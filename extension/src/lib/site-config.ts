/**
 * Manages site-specific configuration including API key and context
 */
export class SiteConfig {
  private static instance: SiteConfig;
  private apiKey: string | null = null;
  private siteContext: string | null = null;

  private constructor() {}

  public static getInstance(): SiteConfig {
    if (!SiteConfig.instance) {
      SiteConfig.instance = new SiteConfig();
    }
    return SiteConfig.instance;
  }

  public setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  public setSiteContext(siteContext: string) {
    this.siteContext = siteContext;
  }

  public getApiKey(): string {
    if (!this.apiKey) {
      throw new Error("API key not configured");
    }
    return this.apiKey;
  }

  public getSiteContext(): string {
    if (!this.siteContext) {
      throw new Error("Site context not configured");
    }
    return this.siteContext;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.siteContext);
  }
}

// Export singleton instance
export const siteConfig = SiteConfig.getInstance();
