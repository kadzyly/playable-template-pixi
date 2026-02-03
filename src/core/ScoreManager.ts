type TBonus = { title: string; count?: number; multiplier?: number };

export class ScoreManager {
  private static instance: ScoreManager;

  private scoreDefault = 0;

  private currentScore: number;

  private constructor() {
    this.resetScore();
  }

  public static getInstance(): ScoreManager {
    if (!ScoreManager.instance) {
      ScoreManager.instance = new ScoreManager();
    }
    return ScoreManager.instance;
  }

  public getScoreDefault(): number {
    return this.scoreDefault;
  }

  public getCurrentScore(): number {
    return this.currentScore;
  }

  public addScore(value: number) {
    this.currentScore += value;
  }

  private resetScore() {
    this.currentScore = this.scoreDefault;
  }
}
