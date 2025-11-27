from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import requests
from datetime import datetime
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = Flask(__name__)
CORS(app)

# 加载卦象数据
def load_hexagram_data():
    hexagram_data = {}
    # 这里可以加载Python版本的卦象数据
    # 暂时使用硬编码的示例数据
    hexagram_data = {
        "i_111111": {
            "name": "乾卦",
            "alternate": "乾为天", 
            "meaning": "刚健中正",
            "original_text": "乾。元，亨，利，贞。",
            "structure": "上乾下乾"
        },
        "i_000000": {
            "name": "坤卦",
            "alternate": "坤为地",
            "meaning": "柔顺伸展", 
            "original_text": "坤。元，亨，利牝马之贞。",
            "structure": "上坤下坤"
        }
        # 可以添加更多卦象数据
    }
    return hexagram_data

hexagram_data = load_hexagram_data()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/api/divine', methods=['POST'])
def divine():
    """
    起卦接口
    接收铜钱投掷结果，返回卦象信息
    """
    try:
        data = request.get_json()
        coin_results = data.get('coin_results', [])
        
        if len(coin_results) != 6:
            return jsonify({"error": "需要6次投掷结果"}), 400
        
        # 计算本卦和变爻
        original_yaos = coin_results
        moving_lines = []
        changed_yaos = []
        
        for i, yao in enumerate(coin_results):
            if yao == 6:  # 老阴变阳
                moving_lines.append(i)
                changed_yaos.append(7)  # 变为少阳
            elif yao == 9:  # 老阳变阴
                moving_lines.append(i)
                changed_yaos.append(8)  # 变为少阴
            else:
                changed_yaos.append(yao)
        
        # 生成卦象编码
        def yaos_to_binary(yaos):
            return ''.join(['1' if y > 7 else '0' for y in yaos])
        
        original_code = f"i_{yaos_to_binary(original_yaos)}"
        changed_code = f"i_{yaos_to_binary(changed_yaos)}"
        
        # 获取卦象信息
        original_hexagram = hexagram_data.get(original_code, {
            "name": "未知卦",
            "alternate": "未知",
            "meaning": "未知含义",
            "original_text": "未知卦辞",
            "structure": "未知结构"
        })
        
        changed_hexagram = hexagram_data.get(changed_code, {
            "name": "未知卦",
            "alternate": "未知", 
            "meaning": "未知含义",
            "original_text": "未知卦辞",
            "structure": "未知结构"
        })
        
        result = {
            "original_hexagram": {
                "code": original_code,
                "yaos": original_yaos,
                **original_hexagram
            },
            "changed_hexagram": {
                "code": changed_code,
                "yaos": changed_yaos,
                **changed_hexagram
            },
            "moving_lines": moving_lines,
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/interpret', methods=['POST'])
def interpret():
    """
    深度解读接口 - 需要付费验证
    """
    try:
        data = request.get_json()
        hexagram_code = data.get('hexagram_code')
        moving_lines = data.get('moving_lines', [])
        payment_verified = data.get('payment_verified', False)
        
        if not payment_verified:
            return jsonify({
                "error": "需要付费验证",
                "payment_required": True,
                "amount": 9.9,
                "currency": "CNY"
            }), 402
        
        # 这里可以集成AI模型生成深度解读
        # 暂时返回示例解读
        hexagram_info = hexagram_data.get(hexagram_code, {})
        
        interpretation = {
            "hexagram_code": hexagram_code,
            "detailed_analysis": f"这是{hexagram_info.get('name', '未知卦')}的深度解读...",
            "moving_line_analysis": f"变爻分析: {len(moving_lines)}个变爻",
            "ai_suggestion": "AI个性化建议: 根据卦象显示，建议您...",
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify(interpretation)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ai-analysis', methods=['POST'])
def ai_analysis():
    """
    AI深度解析接口
    """
    try:
        data = request.get_json()
        hexagram_data = data.get('hexagram_data')
        
        # 获取DeepSeek API密钥（从环境变量或配置文件）
        api_key = os.environ.get('DEEPSEEK_API_KEY', 'your-deepseek-api-key-here')
        print(f"使用API密钥: {api_key[:10]}...")
        
        # 构建完整的卦象信息
        original_hexagram = hexagram_data.get('original_hexagram', {})
        changed_hexagram = hexagram_data.get('changed_hexagram', {})
        moving_lines = hexagram_data.get('moving_lines', [])
        
        # 获取卦名和卦象
        original_name = original_hexagram.get('name', '')
        original_alternate = original_hexagram.get('alternate', '')
        original_meaning = original_hexagram.get('meaning', '')
        original_structure = original_hexagram.get('structure', '')
        original_yaos = original_hexagram.get('yaos', [])
        
        changed_name = changed_hexagram.get('name', '')
        changed_alternate = changed_hexagram.get('alternate', '')
        changed_meaning = changed_hexagram.get('meaning', '')
        
        # 获取卦象编码
        result_code = f"{original_name}({original_alternate})"
        
        # 构建变爻位置描述
        yao_positions = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']
        moving_lines_desc = []
        for pos in moving_lines:
            if 0 <= pos < len(yao_positions):
                yao_value = original_yaos[pos] if pos < len(original_yaos) else '未知'
                yao_type = '老阴变阳' if yao_value == 6 else '老阳变阴' if yao_value == 9 else '不变'
                moving_lines_desc.append(f"{yao_positions[pos]}（{yao_type}）")
        
        # 构建更简洁的提示词
        prompt = f"""
作为周易专家，请对{original_name}（{original_alternate}）进行深度解析。

卦象含义：{original_meaning}
变卦：{changed_name}（{changed_meaning}）
变爻：{len(moving_lines)}个

请从以下角度解析：
1. 卦象整体意义
2. 当前运势分析
3. 变卦转变意义
4. 个性化建议
5. 近期行动指南

请用简洁专业的语言进行解析，结合现代生活实际。
"""
        
        # 基于具体卦象的智能解析
        def generate_hexagram_specific_analysis(code, name, alternate, meaning, changed_name, changed_meaning, moving_lines):
            # 卦象特性和建议映射
            hexagram_characteristics = {
                "乾卦": {
                    "特性": "刚健中正，天道运行",
                    "适合": ["领导力", "开创事业", "刚正不阿"],
                    "避免": ["急躁冒进", "刚愎自用"],
                    "建议": "发挥天行健的精神，以坚韧不拔的意志面对挑战"
                },
                "坤卦": {
                    "特性": "柔顺伸展，厚德载物",
                    "适合": ["团队合作", "辅助他人", "稳步发展"],
                    "避免": ["优柔寡断", "过度依赖"],
                    "建议": "以柔克刚，用包容和耐心等待时机"
                },
                "节卦": {
                    "特性": "万物有节，适度有度",
                    "适合": ["节俭理财", "规律生活", "适度控制"],
                    "避免": ["过度节制", "缺乏灵活性"],
                    "建议": "在节制中找到平衡，既要有原则又要灵活应对"
                },
                "乾为天": {
                    "特性": "天道运行，刚健不息",
                    "适合": ["追求卓越", "勇于开拓", "建立标准"],
                    "避免": ["高高在上", "脱离实际"],
                    "建议": "以天道为准则，在追求完美的同时保持谦逊"
                }
                # 可以继续添加更多卦象的特性
            }
            
            # 获取卦象特性
            char_info = hexagram_characteristics.get(name, hexagram_characteristics.get(alternate.split('为')[0], {
                "特性": f"{meaning}的智慧",
                "适合": ["顺势而为", "把握机遇"],
                "避免": ["逆势而动", "盲目行动"],
                "建议": f"根据卦象显示，现在是{meaning}的最佳时机"
            }))
            
            # 变爻分析
            yao_analysis = ""
            if moving_lines:
                yao_positions = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']
                yao_meanings = {
                    0: "根基不稳，需要夯实基础",
                    1: "中层发展，注意人际和谐",
                    3: "高位发展，把握领导机遇",
                    4: "极盛时期，谨防过犹不及",
                    5: "顶层智慧，领悟人生真谛"
                }
                yao_analysis = f"\n### 变爻分析\n"
                for pos in moving_lines:
                    if pos < len(yao_positions):
                        yao_analysis += f"- **{yao_positions[pos]}**：{yao_meanings.get(pos, '爻位变化带来机遇')}，需要{char_info['建议']}\n"
            
            return f"""
## {name}深度解析

### 卦象核心意义
{name}（{alternate}）{char_info['特性']}。这个卦象昭示着{meaning}的智慧，预示着您当前正处于一个需要{meaning}的阶段。

### 卦象解读
{original_meaning}的内涵在于提醒您要在当前的环境中{char_info['建议']}。正如《周易》所言："{original_name}，{original_meaning}。"

### 个性化运势分析
基于{code}卦象特性：
- **事业发展**：{', '.join(char_info['适合'])}最适合当前发展
- **人际关系**：以{meaning}为原则处理人际，贵人相助
- **财运管理**：根据卦象所示，建议{char_info['适合'][0] if char_info['适合'] else '理性消费'}
- **健康养生**：遵循{char_info['特性']}的节奏，{char_info['建议']}

{yao_analysis}

### 变卦智慧
从{name}变为{changed_name}，意味着{changed_meaning}。这种变化提示您{char_info['建议']}。

### 传统智慧指引
《象传》曰："{alternate}，{meaning}。"提醒我们要{char_info['建议']}，在{meaning}中找到平衡。

### 近期行动指南
1. **明确目标**：根据{char_info['特性']}制定清晰的行动计划
2. **把握时机**：{meaning}的智慧告诉我们何时进退
3. **坚持原则**：{char_info['适合'][0] if char_info['适合'] else '始终保持初心'}
4. **谨慎行事**：{char_info['避免'][0] if char_info['避免'] else '注意细节'}

**记住：{char_info['建议']}，真正的成功在于{meaning}的智慧实践。**

*注：此解析基于传统《周易》卦象智慧，结合现代生活实际指导。*
"""

        # 生成基于具体卦象的个性化解析
        analysis = generate_hexagram_specific_analysis(
            result_code, original_name, original_alternate, original_meaning,
            changed_name, changed_meaning, moving_lines
        )
        
        print(f"生成个性化解析：{original_name}")
        
        # 保存个性化解析结果
        custom_analysis = analysis

        # 调用DeepSeek API
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': 'deepseek-chat',
            'messages': [
                {
                    'role': 'system',
                    'content': '你是一位精通周易传统文化的专家，擅长用现代语言解读卦象，为求卦者提供智慧和指导。'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'temperature': 0.7,
            'max_tokens': 2000
        }
        
        try:
            print(f"正在调用DeepSeek API，超时时间：30秒")
            response = requests.post(
                'https://api.deepseek.com/v1/chat/completions',
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                analysis = result['choices'][0]['message']['content']
                
                return jsonify({
                    'success': True,
                    'analysis': analysis,
                    'hexagram_name': original_name,
                    'hexagram_number': '',
                    'is_simulated': False
                })
            else:
                print(f"DeepSeek API错误: {response.status_code} - {response.text}")
                # 返回模拟结果
                analysis = f"""
## {original_name}深度解析（API调用失败，使用模拟结果）

### 卦象整体意义
{original_name}（{original_alternate}）象征着{original_meaning}。

### 当前运势分析
根据卦象显示，您正处于一个{original_meaning}的阶段。

### 个性化建议
建议保持积极心态，抓住机遇。

**注意：DeepSeek API调用失败，这是模拟解析。**
"""
                return jsonify({
                    'success': True,
                    'analysis': analysis,
                    'hexagram_name': original_name,
                    'hexagram_number': '',
                    'is_simulated': True,
                    'api_error': f'DeepSeek API错误: {response.status_code}'
                })
                
        except requests.exceptions.Timeout:
            print("DeepSeek API请求超时")
            # 返回模拟结果
            analysis = f"""
## {original_name}深度解析（API超时，使用模拟结果）

### 卦象整体意义
{original_name}（{original_alternate}）象征着{original_meaning}。

### 当前运势分析
根据卦象显示，您正处于一个{original_meaning}的阶段。

### 个性化建议
建议保持耐心，等待时机。

**注意：DeepSeek API请求超时，这是模拟解析。**
"""
            return jsonify({
                'success': True,
                'analysis': analysis,
                'hexagram_name': original_name,
                'hexagram_number': '',
                'is_simulated': True,
                'api_error': '请求超时'
            })
        except Exception as e:
            print(f"DeepSeek API异常: {str(e)}")
            # 如果有自定义解析，返回自定义结果，否则使用通用模拟结果
            if 'custom_analysis' in locals():
                return jsonify({
                    'success': True,
                    'analysis': custom_analysis,
                    'hexagram_name': original_name,
                    'hexagram_number': '',
                    'is_simulated': True,
                    'note': '基于传统周易算法的个性化解析'
                })
            else:
                analysis = f"""
## {original_name}深度解析（API异常，使用模拟结果）

### 卦象整体意义
{original_name}（{original_alternate}）象征着{original_meaning}。

### 当前运势分析
根据卦象显示，您正处于一个{original_meaning}的阶段。

### 个性化建议
建议保持冷静，理性分析。

**注意：DeepSeek API异常，这是模拟解析。**
"""
                return jsonify({
                    'success': True,
                    'analysis': analysis,
                    'hexagram_name': original_name,
                    'hexagram_number': '',
                    'is_simulated': True,
                    'api_error': str(e)
                })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'服务器错误: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)