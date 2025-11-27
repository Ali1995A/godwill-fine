import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

def test_real_ai_analysis():
    """测试真实的AI分析"""
    api_key = os.environ.get('DEEPSEEK_API_KEY')
    
    if not api_key or api_key == 'your-deepseek-api-key-here':
        print("API密钥未配置")
        return
    
    print(f"使用API密钥: {api_key[:10]}...")
    
    # 构建与后端相同的提示词
    prompt = """
请根据周易传统文化，对以下卦象进行深度解析：

【核心卦象信息】
本卦：乾卦（乾为天）
卦象结构：上乾下乾
卦象含义：刚健中正

变卦：坤卦（坤为地）
变卦含义：柔顺伸展

【变爻信息】
变爻数量：2个
变爻位置：初爻（老阳变阴）、五爻（老阳变阴）

【卦象分析要求】
请从以下几个方面进行详细解读：
1. 本卦的整体象征意义和核心思想
2. 变卦的转变意义和预示
3. 各变爻的具体解析（包括对应的爻辞和现代解读）
4. 对求卦者当前处境的启示
5. 未来发展趋势和建议
6. 相关的传统文化典故和智慧

请用专业、温暖、富有智慧的语言进行解析，既要尊重传统文化，又要结合现代生活实际。
"""
    
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
        print("正在调用DeepSeek API...")
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=20
        )
        
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            message = result['choices'][0]['message']['content']
            print("✅ AI解析成功！")
            print(f"解析结果: {message[:500]}...")
            return True
        else:
            print(f"❌ API调用失败: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("⏰ API请求超时")
        return False
    except Exception as e:
        print(f"❌ 连接错误: {str(e)}")
        return False

if __name__ == "__main__":
    print("测试真实的DeepSeek AI解析...")
    success = test_real_ai_analysis()
    if success:
        print("\n🎉 真实AI解析功能正常！")
    else:
        print("\n💡 需要进一步排查API连接问题")