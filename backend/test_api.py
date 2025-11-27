import requests
import json

def test_ai_analysis():
    """测试AI深度解析API"""
    
    # 测试数据
    test_data = {
        "hexagram_data": {
            "original_hexagram": {
                "name": "乾卦",
                "alternate": "乾为天",
                "meaning": "刚健中正",
                "structure": "上乾下乾",
                "yaos": [7, 7, 7, 7, 7, 7]
            },
            "changed_hexagram": {
                "name": "坤卦",
                "alternate": "坤为地",
                "meaning": "柔顺伸展",
                "structure": "上坤下坤"
            },
            "moving_lines": []
        }
    }
    
    try:
        print("正在测试AI深度解析API...")
        response = requests.post(
            'http://localhost:5000/api/ai-analysis',
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        print(f"状态码: {response.status_code}")
        print(f"响应内容: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"成功: {result.get('success')}")
            print(f"是否模拟: {result.get('is_simulated', False)}")
            if result.get('api_error'):
                print(f"API错误: {result.get('api_error')}")
            if result.get('analysis'):
                print(f"解析结果长度: {len(result.get('analysis', ''))}")
        else:
            print(f"请求失败: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("连接错误: 请确保后端服务器正在运行")
    except requests.exceptions.Timeout:
        print("请求超时")
    except Exception as e:
        print(f"测试失败: {str(e)}")

if __name__ == "__main__":
    test_ai_analysis()