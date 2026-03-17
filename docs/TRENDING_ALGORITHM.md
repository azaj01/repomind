# Trending Repository Algorithm

## Overview

RepoMind uses a sophisticated trending algorithm to identify repositories that are gaining momentum on GitHub. This document explains how the trending score is calculated and how repository fetching is scheduled.

## Why We Changed the Approach

### Previous Implementation
- Fetched repositories based solely on stars and pushed date
- All tiers were refreshed weekly
- Did not capture repositories that were "trending" or gaining momentum
- All-time popular repos were unnecessarily re-fetched weekly

### New Implementation
- Calculates a **trending score** based on star velocity, recent activity, and push recency
- All-time tier is refreshed only every **5 years** (or manually)
- Trending tiers (weekly, monthly, 6-month, yearly) are refreshed weekly
- Captures repositories that are catching momentum on the internet

## Trending Score Formula

The trending score combines three key factors:

```javascript
trending_score = (star_velocity_norm × weight1) +
                 (recent_star_norm × weight2) +
                 (push_recency_score × weight3 × 10)
```

### Components

#### 1. Star Velocity
Measures how fast a repository is gaining stars relative to its age:

```javascript
star_velocity = total_stars / days_since_creation
star_velocity_norm = log10(star_velocity + 1)
```

**Why it matters:** A repository with 1000 stars in 10 days is more impressive than one with 10,000 stars over 10 years.

#### 2. Recent Star Estimate
Estimates how many stars were gained recently based on activity:

```javascript
push_recency_score = exp(-days_since_push / tier_days)
recent_star_estimate = star_velocity × push_recency_score × tier_days
recent_star_norm = log10(recent_star_estimate + 1)
```

**Why it matters:** Repositories with recent pushes are likely gaining stars now, not in the distant past.

#### 3. Push Recency
Measures how recently the repository was updated:

```javascript
push_recency_score = exp(-days_since_push / tier_days)
```

**Why it matters:** Active repositories are more relevant and likely to be trending.

### Weights by Tier

Different tiers use different weights to optimize for their time window:

| Tier | Star Velocity | Recent Stars | Push Recency | Description |
|------|--------------|--------------|--------------|-------------|
| **weekly** | 0.6 | 0.3 | 0.1 | Emphasizes rapid star growth |
| **monthly** | 0.5 | 0.3 | 0.2 | Balances growth and activity |
| **6-month** | 0.4 | 0.3 | 0.3 | Equal focus on all factors |
| **yearly** | 0.4 | 0.3 | 0.3 | Long-term trending |
| **all-time** | N/A | N/A | N/A | No trending score (sorted by stars) |

## Repository Tiers

### All-Time Tier (4000 repos)
- **Refresh frequency:** Every 5 years or manual trigger
- **Criteria:** Stars ≥ 2000, sorted by star count
- **Purpose:** Capture legendary, all-time popular repositories
- **Scoring:** No trending score; raw star count only

### Yearly Tier (2000 repos)
- **Refresh frequency:** Weekly
- **Criteria:** Pushed in last 365 days, stars ≥ 500
- **Purpose:** Repositories trending over the past year
- **Scoring:** Trending algorithm with balanced weights

### 6-Month Tier (800 repos)
- **Refresh frequency:** Weekly
- **Criteria:** Pushed in last 180 days, stars ≥ 200
- **Purpose:** Repositories gaining traction in recent months
- **Scoring:** Trending algorithm with balanced weights

### Monthly Tier (500 repos)
- **Refresh frequency:** Weekly
- **Criteria:** Pushed in last 30 days, stars ≥ 100
- **Purpose:** Hot repositories trending this month
- **Scoring:** Emphasizes star velocity

### Weekly Tier (300 repos)
- **Refresh frequency:** Weekly
- **Criteria:** Pushed in last 7 days, stars ≥ 50
- **Purpose:** Hottest repositories trending right now
- **Scoring:** Maximum emphasis on star velocity

## Workflow Scheduling

### Automated Refresh
```yaml
schedule:
  - cron: "0 3 * * 1"  # Every Monday at 3 AM UTC
```

**What gets refreshed:**
- Weekly, monthly, 6-month, and yearly tiers (always)
- All-time tier (only if 5 years have passed since last refresh)

### Manual Refresh
```bash
# Refresh all tiers including all-time
gh workflow run refresh-repo-catalog.yml

# Force refresh all-time tier
gh workflow run refresh-repo-catalog.yml -f force_all_time=true
```

### Conditional All-Time Refresh

The workflow automatically checks when all-time tier was last refreshed:

```bash
LAST_ALLTIME=$(git log --all --grep="all-time tier" --pretty=format:'%ad' -1)
DAYS_SINCE=$((now - LAST_ALLTIME))

if [ $DAYS_SINCE -gt 1825 ]; then  # 1825 days = 5 years
  # Refresh all-time tier
fi
```

## Implementation Details

### Fetching Strategy

For trending tiers:
1. Fetch **2× target** repositories to ensure good selection
2. Calculate trending score for each repository
3. Sort by trending score (descending)
4. Take top N repositories up to target

Example for weekly tier (target: 300):
- Fetch ~600 repositories with stars ≥ 50 and pushed in last 7 days
- Calculate trending scores
- Select top 300 by trending score

### Deduplication

Repositories are deduplicated across all tiers:
- A repository can only appear in one tier
- Higher tiers take precedence (all-time > yearly > 6-month > monthly > weekly)
- Deduplication key: `${owner}/${repo}` (case-insensitive)

### Data Format

Output: `public/data/top-repos.json`

```json
[
  {
    "owner": "microsoft",
    "repo": "semantic-kernel",
    "stars": 25847,
    "description": "Integrate cutting-edge LLM technology...",
    "topics": ["ai", "llm", "semantic-kernel"],
    "language": "C#",
    "tier": "monthly",
    "rank": 4532,
    "trendingScore": 12.45
  }
]
```

**Note:** `trendingScore` is only present for repos in trending tiers (not all-time).

## Advantages of This Approach

### 1. Captures True Momentum
The algorithm identifies repositories that are:
- Gaining stars rapidly (star velocity)
- Recently active (push recency)
- Growing in popularity (recent star estimate)

### 2. Efficient Resource Usage
- All-time tier refreshed only every 5 years
- Reduces unnecessary API calls
- Focuses computational resources on trending detection

### 3. Time-Appropriate Weights
Each tier optimizes for its time window:
- Weekly: Prioritizes rapid growth
- Monthly: Balances growth and activity
- Yearly: Long-term trending patterns

### 4. Discoverable and Transparent
- Trending scores are stored in the data file
- Can be displayed in UI to show "trending strength"
- Algorithm is documented and tunable

## Example: Trending Score Calculation

Let's calculate the trending score for a hypothetical repository in the **weekly** tier:

**Repository details:**
- Total stars: 500
- Created: 30 days ago
- Last pushed: 2 days ago
- Tier: weekly (7-day window)

**Calculations:**

1. **Star velocity:**
   ```
   star_velocity = 500 / 30 = 16.67 stars/day
   star_velocity_norm = log10(16.67 + 1) = 1.247
   ```

2. **Push recency score:**
   ```
   push_recency_score = exp(-2 / 7) = 0.751
   ```

3. **Recent star estimate:**
   ```
   recent_star_estimate = 16.67 × 0.751 × 7 = 87.6
   recent_star_norm = log10(87.6 + 1) = 1.948
   ```

4. **Trending score** (weekly weights: 0.6, 0.3, 0.1):
   ```
   trending_score = (1.247 × 0.6) + (1.948 × 0.3) + (0.751 × 0.1 × 10)
                  = 0.748 + 0.584 + 0.751
                  = 2.083
   ```

**Result:** This repository would have a trending score of **2.08**, indicating moderate-to-strong trending momentum.

## Monitoring and Validation

### Data Integrity Check
The workflow validates that the catalog contains at least 3000 repositories:

```bash
REPO_COUNT=$(grep -c '"owner"' public/data/top-repos.json)
if [ "$REPO_COUNT" -lt 3000 ]; then
  echo "Error: Catalog size below minimum threshold"
  exit 1
fi
```

### Logging and Observability

The script logs:
- Number of repositories fetched per tier
- Top and median trending scores
- Sample trending repositories
- Processing time and API rate limit status

Example output:
```
📦 Tier: weekly (Target: 300)
   🔍 Fetching weekly - is:public archived:false pushed:>=2026-03... (Page 1)
   📈 Calculating trending scores for 578 candidates...
   📊 Top trending score: 4.23
   📊 Median trending score: 2.15
   ✅ Finished weekly: +300 repos

🔥 Sample trending repositories:
   • microsoft/semantic-kernel (25847⭐, trending: 4.23)
   • anthropics/claude-code (8934⭐, trending: 3.87)
```

## Future Enhancements

Potential improvements to consider:

1. **Fork velocity:** Include fork rate in trending score
2. **Issue/PR activity:** Factor in community engagement
3. **Language-specific trending:** Calculate trending within each language category
4. **Topic-specific trending:** Identify trending within specific topic areas
5. **Geographic trending:** Consider timezone-based activity patterns
6. **Machine learning:** Train a model to predict "breakout" repositories

## Testing the Algorithm

### Local Testing

Run the script locally to test the algorithm:

```bash
# Full refresh (all tiers)
GITHUB_TOKEN=your_token node scripts/fetch-trending-repos.mjs

# Skip all-time tier
GITHUB_TOKEN=your_token node scripts/fetch-trending-repos.mjs --skip-all-time
```

### Validating Results

Check the output file for expected structure:

```bash
# Count total repos
jq 'length' public/data/top-repos.json

# Count repos per tier
jq 'group_by(.tier) | map({tier: .[0].tier, count: length})' public/data/top-repos.json

# Show top 5 trending repos
jq '[.[] | select(.trendingScore != null)] | sort_by(-.trendingScore) | .[0:5]' public/data/top-repos.json
```

## References

- GitHub Search API: https://docs.github.com/en/rest/search
- GitHub Rate Limiting: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
- RepoMind Architecture: /README.md
