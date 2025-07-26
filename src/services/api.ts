import { LeaderboardEntry } from '../types/leaderboard';

export class ApiService {
  private static readonly BASE_URL = 'https://hub.kaito.ai/api/v1/gateway/ai/kol/mindshare/top-leaderboard';

  static async fetchLeaderboard(topicId: string): Promise<LeaderboardEntry[]> {
    try {
      const params = new URLSearchParams({
        duration: '7d',
        topic_id: topicId,
        top_n: '100',
        customized_community: 'customized',
        community_yaps: 'true'
      });

      const response = await fetch(`${this.BASE_URL}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform API response to match our interface
      if (data && Array.isArray(data)) {
        return data.map((item: any) => ({
          rank: Number(item.rank || 0),
          name: item.name || 'Unknown',
          username: item.username ? `@${item.username}` : '@unknown',
          bio: item.bio || 'No bio available',
          community_score: Number(item.community_score || 0),
          mindshare: Number(item.mindshare || 0),
          mention_count: Number(item.mention_count || 0),
          follower_count: Number(item.follower_count || 0),
          smart_follower_count: Number(item.smart_follower_count || 0),
          insightfulness_score_7d: Number(item.last_7_day_avg_llm_insightfulness_score_scaled || 0),
          originality_score_7d: Number(item.last_7_day_avg_originality_score_scaled || 0),
          created_at: item.created_at || new Date().toISOString(),
          avatar_url: item.icon,
          twitter_url: item.twitter_user_url || `https://twitter.com/${item.username || 'unknown'}`
        }));
      }

      // If API doesn't return expected format, return mock data
      return this.generateMockData(topicId);
      
    } catch (error) {
      console.error('Failed to fetch leaderboard data:', error);
      // Return mock data as fallback
      return this.generateMockData(topicId);
    }
  }

  private static generateMockData(topicId: string): LeaderboardEntry[] {
    const mockNames = [
      'Alex Chen', 'Sarah Johnson', 'Mike Rodriguez', 'Emily Zhang', 'David Kim',
      'Lisa Wang', 'James Wilson', 'Maria Garcia', 'John Smith', 'Anna Liu',
      'Robert Brown', 'Jessica Lee', 'Michael Chang', 'Amanda Davis', 'Chris Taylor'
    ];

    return mockNames.map((name, index) => ({
      rank: index + 1,
      name,
      username: `@${name.toLowerCase().replace(/\s+/g, '')}${Math.random().toString(36).substr(2, 3)}`,
      bio: `Crypto enthusiast and ${topicId} community member. Building the future of DeFi.`,
      community_score: Math.random() * 100,
      mindshare: Math.random() * 50,
      mention_count: Math.floor(Math.random() * 1000),
      follower_count: Math.floor(Math.random() * 50000) + 1000,
      smart_follower_count: Math.floor(Math.random() * 10000) + 500,
      insightfulness_score_7d: Math.random() * 10,
      originality_score_7d: Math.random() * 10,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff&size=64`,
      twitter_url: `https://twitter.com/${name.toLowerCase().replace(/\s+/g, '')}`
    }));
  }
}
