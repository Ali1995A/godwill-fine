/**
 * 占卜核心算法 - 从Python移植
 * 基于传统"混沌初开"算法
 */

interface ChaosResult {
  sky: number;
  land: number;
  human: number;
}

export class BChanges {
  /**
   * 生成单个爻位的结果
   * @param seed 随机种子，如果为0则使用随机数
   * @returns 爻值（0或1）
   */
  yoyo(seed: number): number {
    if (seed === 0) {
      seed = 10;
    }
    
    // 三次变化过程
    let grass = 49;
    
    // 第一次变化
    let chaosResult = this.chaos(grass, seed);
    chaosResult = this.change(chaosResult.sky, chaosResult.land, chaosResult.human);
    grass = chaosResult.sky + chaosResult.land;
    
    // 第二次变化
    chaosResult = this.chaos(grass, seed);
    chaosResult = this.change(chaosResult.sky, chaosResult.land, chaosResult.human);
    grass = chaosResult.sky + chaosResult.land;
    
    // 第三次变化
    chaosResult = this.chaos(grass, seed);
    chaosResult = this.change(chaosResult.sky, chaosResult.land, chaosResult.human);
    grass = chaosResult.sky + chaosResult.land;
    
    // 传统文化中：阳爻为1，阴爻为0
    // 根据传统算法，grass除以4的结果为6、7、8、9
    // 6为老阴，7为少阳，8为少阴，9为老阳
    const yaoResult = Math.floor(grass / 4);
    
    // 转换为二进制：阳爻为1，阴爻为0
    // 老阳(9)和少阳(7)都是阳爻，老阴(6)和少阴(8)都是阴爻
    return yaoResult % 2 === 1 ? 1 : 0;
  }

  /**
   * 变化算法
   * @param sky 天数
   * @param land 地数  
   * @param human 人数
   * @returns 变化后的结果
   */
  private change(sky: number, land: number, human: number): ChaosResult {
    let skyChange = sky % 4;
    let landChange = land % 4;
    
    if (skyChange === 0) {
      skyChange = 4;
    }
    sky -= skyChange;
    human += skyChange;
    
    if (landChange === 0) {
      landChange = 4;
    }
    land -= landChange;
    human += landChange;
    
    return { sky, land, human };
  }

  /**
   * 混沌初开算法 - 将49颗算子分为天、地、人
   * @param grass 剩余算子数
   * @param seed 随机种子
   * @returns 天地人分配
   */
  private chaos(grass: number, seed: number): ChaosResult {
    const sky = Math.floor(Math.random() * (grass - 1)) + 1;
    const land = grass - sky - 1;
    const human = 1;
    
    return { sky, land, human };
  }
}

/**
 * 主占卜函数
 * @param seeds 可选的种子数组，用于指定某些爻位
 * @returns 占卜结果对象
 */
export function godwill(seeds: number[] = []): DivinationResult {
  const bc = new BChanges();
  const yoyo: number[] = [];
  
  // 使用提供的种子
  for (const seed of seeds) {
    yoyo.push(bc.yoyo(seed));
  }
  
  // 如果种子不够6个，补充随机爻
  while (yoyo.length < 6) {
    yoyo.push(bc.yoyo(0));
  }
  
  // 生成二进制编码的卦象标识符
  // 传统文化中卦象是从下往上排列的，所以数组顺序就是显示顺序
  // 第1个元素是初爻（最下面），第6个元素是上爻（最上面）
  const gwillCode = "i_" +
    yoyo.map(y => String(y & 1)).join('');
  
  return {
    code: gwillCode,
    yaos: yoyo.slice(0, 6).map(binary => binary === 1 ? 7 : 8), // 转换为6,7,8,9格式
    timestamp: new Date().toISOString()
  };
}

export interface DivinationResult {
  code: string;      // 卦象编码如 "i_111111"
  yaos: number[];    // 6个爻位值 [6,7,8,9] (6=老阴,7=少阳,8=少阴,9=老阳)
  timestamp: string; // 占卜时间
}

/**
 * 铜钱投掷算法 - 三枚铜钱法
 * 背面（无字）= 3，正面（有字）= 2
 * 1背2字 (3+2+2=7)： 少阳（不变的阳爻）
 * 2背1字 (3+3+2=8)： 少阴（不变的阴爻）
 * 3背 (3+3+3=9)： 老阳（变爻，阳变阴）
 * 3字 (2+2+2=6)： 老阴（变爻，阴变阳）
 */
export interface CoinDivinationResult {
  yaos: number[];      // 6个爻的值 (6=老阴, 7=少阳, 8=少阴, 9=老阳)
  code: string;        // 卦象编码 i_xxxxxx
  originalCode: string; // 本卦编码
  changedCode: string;  // 变卦编码
  movingLines: number[]; // 变爻位置
  timestamp: string;   // 占卜时间戳
}

export function coinDivination(coinResults: number[]): CoinDivinationResult {
  if (coinResults.length !== 6) {
    throw new Error('需要6次投掷结果');
  }

  // 计算本卦和变爻
  const originalYaos = [...coinResults];
  const movingLines: number[] = [];
  const changedYaos = coinResults.map((yao, index) => {
    if (yao === 6) { // 老阴变阳
      movingLines.push(index);
      return 7; // 变为少阳
    } else if (yao === 9) { // 老阳变阴
      movingLines.push(index);
      return 8; // 变为少阴
    }
    return yao;
  });

  // 生成卦象编码（阳爻=1，阴爻=0）
  const originalBinary = originalYaos.map(yao => yao > 7 ? 1 : 0);
  const changedBinary = changedYaos.map(yao => yao > 7 ? 1 : 0);

  const originalCode = `i_${originalBinary.join('')}`;
  const changedCode = `i_${changedBinary.join('')}`;

  return {
    yaos: originalYaos,
    code: originalCode,
    originalCode,
    changedCode,
    movingLines,
    timestamp: new Date().toISOString()
  };
}

/**
 * 随机铜钱投掷 - 生成6次投掷结果
 */
export function randomCoinToss(): number[] {
  return Array.from({ length: 6 }, () => {
    // 模拟三枚铜钱投掷
    const coins = Array.from({ length: 3 }, () => Math.random() > 0.5 ? 3 : 2);
    const total = coins.reduce((sum, value) => sum + value, 0);
    
    // 根据总和确定爻的类型
    if (total === 6) return 6;      // 老阴
    if (total === 7) return 7;      // 少阳
    if (total === 8) return 8;      // 少阴
    return 9;                       // 老阳
  });
}