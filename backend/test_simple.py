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
        response = requests.post(url, json=test_data, timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    print("Testing AI Analysis API...")
    test_ai_analysis()