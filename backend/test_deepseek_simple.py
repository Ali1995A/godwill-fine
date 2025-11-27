import os
import requests
from dotenv import load_dotenv

load_dotenv()

def test_deepseek_api():
    api_key = os.environ.get('DEEPSEEK_API_KEY')
    
    if not api_key or api_key == 'your-deepseek-api-key-here':
        print("API密钥未配置或为默认值")
        return False
    
    print(f"API密钥: {api_key[:10]}...")
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'model': 'deepseek-chat',
        'messages': [
            {
                'role': 'user',
                'content': '你好，请回复"测试成功"'
            }
        ],
        'max_tokens': 50
    }
    
    try:
        print("正在测试DeepSeek API连接...")
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=10
        )
        
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            message = result['choices'][0]['message']['content']
            print(f"API测试成功: {message}")
            return True
        elif response.status_code == 401:
            print("API密钥无效或已过期")
            return False
        elif response.status_code == 429:
            print("API调用频率限制")
            return False
        else:
            print(f"API调用失败: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("API请求超时")
        return False
    except Exception as e:
        print(f"连接错误: {str(e)}")
        return False

if __name__ == "__main__":
    print("开始测试DeepSeek API...")
    success = test_deepseek_api()
    if success:
        print("\nDeepSeek API连接正常！")
    else:
        print("\n建议检查：")
        print("1. API密钥是否正确")
        print("2. 网络连接是否正常")
        print("3. API密钥是否有足够的额度")
        print("4. 是否在正确的区域使用API")