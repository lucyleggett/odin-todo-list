import path from "node:path";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/index.html"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: 'body',
      scriptLoading: 'defer',
    }),
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.html$/i,
        use: [{
                loader: "html-loader",
                options: {
                    sources: {
                        urlFilter: (attribute, value) => {
                            return !value.startsWith("http");
                        }
                    }
                }
            }],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        resourceQuery: { not: [/raw/] },
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        resourceQuery: /raw/,
        type: 'asset/source',
      },
    ],
  },
};
