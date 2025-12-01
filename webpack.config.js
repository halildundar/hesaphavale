import MiniCssExtractPlugin from "mini-css-extract-plugin";
import WebpackShellPluginNext from "webpack-shell-plugin-next";
import { resolve, dirname } from "node:path";
import TerserPlugin from "terser-webpack-plugin";
// import nodeExternals from "webpack-node-externals";
import { writeFileSync} from "node:fs";
import { config } from "dotenv";
let time = new Date().getTime();
process.env.WEBSCRIPTNAME = `main${time}`;
process.env.CTRLPANELSCRIPTNAME = `ctrlpanel${time}`;
writeFileSync("./const.env",`NODE_ENV=production\nWEBSCRIPTNAME=main${time}\nCTRLPANELSCRIPTNAME=ctrlpanel${time}`,{encoding:'utf-8'})
config({ path: "./const.env" });
console.log(process.env.NODE_ENV);
export default {
  // mode: "development",
  mode: process.env.NODE_ENV,
  devtool: process.env.NODE_ENV == "development" ? "eval-source-map" : false, //eval
  // devtool:false,
  entry: {
    [process.env.WEBSCRIPTNAME]: "./public/main.js",
    // [process.env.CTRLPANELSCRIPTNAME]: "./public/ctrlpanel.js"
  },
  output: {
    path: resolve(process.cwd(), "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /.(scss|css)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // options: { reloadAll: true },
          },
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(xlsx)$/i,
        type: "asset/resource",
        generator: {
          outputPath: "sablon/",
          publicPath: "./sablon/",
          filename: (name) => {
            let newfilename = name.filename.split("/").slice(2).join("/");
            return newfilename;
          },
        },
      },
{
        test: /\.(woff2|ttf|otf|woff|eot|svg)$/i,
        type: "asset/resource",
        generator: {
          outputPath: "fonts/",
          publicPath: "./fonts/",
          filename: (name) => {
            let newfilename = name.filename.split("/").slice(2).join("/");
            return newfilename;
          },
        },
      },
       {
        test: /\.(ico|txt)$/i,
        type: "asset/resource",
        generator: {
          filename:"[name][ext]",
        },
      },
      {
        test: /\.(png|jp?eg|webp|gif|svg|xlsx)$/i,
        type: "asset/resource",
        generator: {
          outputPath: "assets/",
          publicPath: "./assets//",
          // filename:"[name][ext][query]",
          filename: (name) => {
            return name.filename.split("/").slice(2).join("/");
          },
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: "all",
        extractComments: true,
        minify: TerserPlugin.uglifyJsMinify,
        terserOptions: {
          ecma: import("terser").ECMA | undefined,
          compress: true,
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: true,
        },
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),

    new WebpackShellPluginNext({
      // onAfterDone: {
      //   scripts: ['node webpackutil.js'],
      //   blocking: false,
      //   parallel: true,
      // },
      // onBeforeCompile: {
      //   scripts: ['node webpackutil.js'],
      //   blocking: false,
      //   parallel: false,
      // },
      // onDoneWatch:{
      //   scripts: ['echo "Webpack Start"'],
      //   blocking: true,
      //   parallel: false
      // },
      // onBuildEnd:{
      //   scripts: ['echo "Webpack End"'],
      //   blocking: true,
      //   parallel: false
      // }
    }),
    // new BrowserSyncPlugin({
    //   // browse to http://localhost:3000/ during development,
    //   // ./public directory is being served
    //   host: 'localhost',
    //   port: 4200,
    //   server: { baseDir: ['dist'] }
    // })
   
  ],
  // externalsPresets: { node: true },
  // externals: [nodeExternals()]
};
