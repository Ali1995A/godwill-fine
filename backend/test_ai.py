import requests
import json

def test_ai_analysis():
    """测试AI分析API"""
    url = "http://localhost:5000/api/ai-analysis"
    
    # 测试数据
    test_data = {
        "hexagram_data": {
            "original_hexagram": {
                "name": "乾卦",
                "alternate": "乾为天",
                "meaning": "刚健中正",
                "structure": "上乾下乾",
                "yaos": [9, 7, 8, 7, 9, 8]
            },
            "changed_hexagram": {
                "name": "坤卦",
                "alternate": "坤为地", 
                "meaning": "柔顺伸展",
                "structure": "上坤下坤"
            },
            "moving_lines": [0, 4]  # 初爻和五爻为变爻
        }
    }
    
    try:
        response = requests.post(url, json=test_data, timeout=30)
        print(f"状态码: {response.status_code}")
        print(f"响应内容: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                print("✅ AI解析成功！")
                print(f"卦名: {result.get('hexagram_name')}")
                print(f"解析结果: {result.get('analysis')[:200]}...")
            else:
                print(f"❌ AI解析失败: {result.get('error')}")
        else:
            print(f"❌ 请求失败: {response.status_code}")
            
    except Exception as e:
        print(f"❌ 测试失败: {str(e)}")

if __name__ == "__main__":
    print("测试AI分析API...")
    test_ai_analysis()