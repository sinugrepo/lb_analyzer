export interface LeaderboardEntry {
  rank: number;
  name: string;
  username: string;
  bio: string;
  community_score: number;
  mindshare: number;
  mention_count: number;
  follower_count: number;
  smart_follower_count: number;
  insightfulness_score_7d: number;
  originality_score_7d: number;
  created_at: string;
  avatar_url?: string;
  twitter_url?: string;
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  total: number;
  status: string;
}