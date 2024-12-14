### `npm i` after that `npm start`


### Description
This code creates data structures for products and their images, serializes this data into JSON format, and saves the result into a file. The nlohmann::json library is used to work with JSON in C++.


### Data Structure
Data Structures
Image
Represents an image associated with a product.

`image_id (int):` Unique identifier for the image.
`image_url (string):` URL of the image.
Product
Describes a product.

`{id (int):` Unique identifier for the product.
`stock (int):` The number of items in stock.
`stock_ru (string):` Stock status in Russian.
`stock_en (string):` Stock status in English.
`list_name_en (string):` Product name in English.
`list_name_ru (string):` Product name in Russian.
`list_text_en (string):` Product description in English.
`list_text_ru (string):` Product description in Russian.
`price (double):` Price of the product.
`price_ru (string):` Price in Russian.
`price_en (string):` Price in English.
`forsell (int):` Number of products available for sale.
`category (string):` Product category.
`product_text_en (string):` Additional text describing the product in English.
`product_text_ru (string):` Additional text describing the product in Russian.
`text_product_en (string):` Further description of the product in English.
`text_product_ru (string):` Further description of the product in Russian.
}
`images (vector<Image>): A list of images associated with the product.
`Functions`
`to_json(const Product& product)`
This function serializes a Product structure into JSON format.

It converts each member of the Product structure into a corresponding key-value pair in the JSON object.
For each image in the images list, a separate JSON object is created and added to the images key in the product's JSON representation.

### Main code
`main()`
The main function of the program:

Creates a vector `listData`, which contains data for a product, including images.
For each product in listData, it calls the to_json function to convert the product into a JSON object.
It collects all the JSON objects into an array `j_listData`.
It saves `j_listData` into the file listData.json with indentation for better readability (using 4 spaces).
Saving JSON to a File
After serializing the data, the program saves the resulting JSON to the `listData.json` file with indentation for readability.
The program uses the ofstream stream to open the file for writing.
Example content of the `listData.json`

### nlohmann.json
`nlohmann::json:` A popular library for working with JSON in C++.
It allows for easy conversion between C++ objects and JSON.
It provides a simple interface for creating, reading, and writing JSON.
To use the library, you need to include `#include <nlohmann/json.hpp>`. The library is cross-platform and works with modern C++ compilers.