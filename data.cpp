#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <single/nlohmann/json.hpp>

using namespace std;
using json = nlohmann::json;

struct Image {
    int image_id;
    string image_url;
};

struct Product {
    int id;
    int stock;
    string stock_ru;
    string stock_en;
    string list_name_en;
    string list_name_ru;
    string list_text_en;
    string list_text_ru;
    double price;
    string price_ru;
    string price_en;
    int forsell;
    string category;
    string product_text_en;
    string product_text_ru;
    string text_product_en;
    string text_product_ru;
    vector<Image> images;
};
json to_json(const Product& product) {
    json images_json = json::array();
    for (const auto& image : product.images) {
        images_json.push_back({ {"image_id", image.image_id}, {"image_url", image.image_url} });
    }
    return {
        {"id", product.id},
        {"stock", product.stock},
        {"stock_ru", product.stock_ru},
        {"stock_en", product.stock_en},
        {"list_name_en", product.list_name_en},
        {"list_name_ru", product.list_name_ru},
        {"list_text_en", product.list_text_en},
        {"list_text_ru", product.list_text_ru},
        {"price", product.price},
        {"price_ru", product.price_ru},
        {"price_en", product.price_en},
        {"forsell", product.forsell},
        {"category", product.category},
        {"product_text_en", product.product_text_en},
        {"product_text_ru", product.product_text_ru},
        {"text_product_en", product.text_product_en},
        {"text_product_ru", product.text_product_ru},
        {"images", images_json}
    };
}

int main() {
    vector<Product> listData = {
        {
            1,
            24,
            "В наличии",
            "In stock",
            "A & Sabina",
            "А & Фёрст",
            "1 dushion-cuttt London Blue Topaz 13x10 mm weight 7.06 carats.",
            "1 Лондонский голубой топаз огранки «кушон» 13х10 мм, вес 7,06 карата.",
            24.0,
            "Цена",
            "Price",
            24,
            "kulon",
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit...",
            "Обычный текст , неформатированный текст...",
            "Choosing a future profession can be a difficult task...",
            "Выбор будущей профессии может стать нелегкой задачей...",
            {{1, "https://cdn.shopify.com/s/files/1/0413/6385/products/image1.jpg"},
             {2, "https://cdn.shopify.com/s/files/1/0413/6385/products/image2.jpg"}}
        }
    };

    json j_listData = json::array();
    for (const auto& product : listData) {
        j_listData.push_back(to_json(product));
    }
    
    ofstream file("listData.json");
    file << j_listData.dump(4);
    file.close();

    cout << "JSON файл сохранён!\n";
    return 0;
}
