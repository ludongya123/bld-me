(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/mall/newcar-detail/newcar-detail"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib/index.js?!G:\\小程序\\bld-me\\pages\\mall\\newcar-detail\\newcar-detail.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!G:/小程序/bld-me/pages/mall/newcar-detail/newcar-detail.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;










































































































var _user = __webpack_require__(/*! ../../../api/user.js */ "G:\\小程序\\bld-me\\api\\user.js");
var _mall = __webpack_require__(/*! ../../../api/mall.js */ "G:\\小程序\\bld-me\\api\\mall.js");
var _util = __webpack_require__(/*! ../../../util/util.js */ "G:\\小程序\\bld-me\\util\\util.js");var ChPickTime = function ChPickTime() {return __webpack_require__.e(/*! import() | components/home/baoyang/choosePickTime */ "components/home/baoyang/choosePickTime").then(__webpack_require__.bind(null, /*! ../../../components/home/baoyang/choosePickTime.vue */ "G:\\小程序\\bld-me\\components\\home\\baoyang\\choosePickTime.vue"));};var _default =
{
  data: function data() {
    return {
      ssssId: '',
      carId: '', // 整个页面的车系id
      ziXunCarId: '', //咨询某一车型的车的id
      layerType: -1, // 1询底价 2提交预约试驾
      carIcon: _user.carIcon,
      tel: '',
      yyTime: '',
      isShowChooseTime: false,
      time: {
        timeMsg: null },

      carInfo: {}, // 车辆信息
      onSellInfo: [{ id: 1 }], // 在售车型
      storeInfo: {}, // 门店信息
      configInfo: [], // 车辆配置信息
      richText: '' // 车的详情说明 富文本
    };
  },
  components: {
    ChPickTime: ChPickTime },

  onLoad: function onLoad(opts) {
    this.carId = opts.carId || '';
    this.ssssId = opts.ssssId || '';
    this.getNewCarDetail();
    this.getUserInfo();
  },
  methods: {
    // 显示弹层 询底价、预约时间  
    showLayer: function showLayer(n) {var cid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      if (n == 1) {
        this.ziXunCarId = cid;
      }
      this.layerType = n;
    },
    // 关闭弹层
    closeLayer: function closeLayer() {
      this.layerType = -1;
    },
    // 获取用户手机号
    getUserInfo: function getUserInfo() {var _this = this;
      (0, _user.user)().then(function (res) {
        if (res.data.code == 0) {
          _this.tel = res.data.result.user_info.mobile || '';
        }
      });
    },
    // 车辆详情
    getNewCarDetail: function getNewCarDetail() {var _this2 = this;
      uni.showLoading({
        title: '加载中...' });

      (0, _mall.newCarDetail)({
        data: {
          car_id: this.carId,
          store_id: this.ssssId } }).

      then(function (res) {
        uni.hideLoading();
        if (res.data.code == 0) {var _res$data$result =
          res.data.result,car_info = _res$data$result.car_info,on_sell_info = _res$data$result.on_sell_info,rich_text = _res$data$result.rich_text,store_info = _res$data$result.store_info;
          car_info.car_image = car_info.car_image.split(',');
          car_info.tags = car_info.tags == '' ? [] : car_info.tags.split(',');
          store_info.store_distance = store_info.store_distance > 0 ? (store_info.store_distance / 1000).toFixed(2) : '';
          _this2.carInfo = car_info;
          _this2.richText = rich_text;
          _this2.onSellInfo = on_sell_info;
          _this2.storeInfo = store_info;
          _this2.getCarConfig();
        }
      }).catch(function () {
        uni.hideLoading();
      });
    },
    // 打开车辆配置
    openCarConfig: function openCarConfig(id) {
      uni.navigateTo({
        url: "/pages/mall/car-config/car-config?id=".concat(id) });

    },
    // 获取车辆配置
    getCarConfig: function getCarConfig() {var _this3 = this;
      uni.showLoading({
        title: '加载中...',
        mask: true });

      (0, _mall.carConfig)({
        data: {
          id: this.carId } }).

      then(function (res) {
        uni.hideLoading();
        if (res.data.code == 0) {
          _this3.configInfo = res.data.result.infos[0].items.length > 5 ? res.data.result.infos[0].items.substring(0, 5) : res.data.result.infos[0].items;
          console.log(_this3.configInfo);
        }
      }).catch(function () {
        uni.hideLoading();
      });
    },
    // 打开地图
    openLocation: function openLocation() {
      var coords = (0, _util.bd09togcj02)(this.storeInfo.location.split(',')[0], this.storeInfo.location.split(',')[1]);
      console.log(coords);
      uni.openLocation({
        longitude: coords[0],
        latitude: coords[1],
        name: this.storeInfo.store_name,
        address: this.storeInfo.store_address });

    },
    // 获取可预约时间范围
    getWalkCarTime: function getWalkCarTime() {var _this4 = this;
      uni.showLoading({
        title: '加载中',
        mask: true });

      (0, _mall.reserveTime)({
        data: {
          reserve_store_id: this.ssssId,
          car_id: this.carId } }).

      then(function (res) {
        uni.hideLoading();
        if (res.data.code == 0) {
          _this4.isShowChooseTime = true;
          res.data.result.dates.forEach(function (item, index) {
            item['dateUse'] = item.short_date;
          });
          res.data.result.times = res.data.result.dates;
          delete res.data.result.dates;
          _this4.time.timeMsg = res.data.result;
        } else {
          _this4.time.timeMsg = null;
        }
      });
    },
    // 显示时间选择的弹窗
    showChooseTime: function showChooseTime() {
      this.getWalkCarTime();
    },
    // 确认选择时间
    closeDateModal: function closeDateModal() {var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.isShowChooseTime = false;
      if (data) {
        this.yyTime = data.chooseDateUse + " " + data.chooseDateDesc + " " + data.chooseTimeString;
      }
    },
    // 提交咨询
    submitZiXun: function submitZiXun() {var _this5 = this;
      if (!/^1[3456789]\d{9}$/.test(this.tel)) {
        uni.showToast({
          title: '手机号格式错误',
          icon: 'none' });

        return;
      }
      uni.showLoading({
        title: '提交中...',
        mask: true });

      var data1 = {
        store_id: this.ssssId,
        mobile: this.tel,
        car_id: this.carId },

      data2 = {
        store_id: this.ssssId,
        mobile: this.tel,
        car_item_id: this.ziXunCarId };

      (0, _mall.ziXun)({
        data: this.ziXunCarId == '' ? data1 : data2 }).
      then(function (res) {
        uni.hideLoading();
        if (res.data.code == 0) {
          // 提交咨询成功 
          uni.showToast({
            title: res.data.result.notice,
            icon: 'none',
            mask: true });

          _this5.layerType = -1;
        }
      }).catch(function () {
        uni.hideLoading();
      });
    },
    // 提交试驾
    subTestDrav: function subTestDrav() {var _this6 = this;
      if (!/^1[3456789]\d{9}$/.test(this.tel)) {
        uni.showToast({
          title: '手机号格式错误',
          icon: 'none' });

        return;
      }
      if (this.yyTime == '') {
        uni.showToast({
          title: '请选择预约时间',
          icon: 'none' });

        return;
      }
      uni.showLoading({
        title: '提交中...',
        mask: true });

      (0, _mall.testDriver)({
        data: {
          store_id: this.ssssId,
          car_id: this.carId,
          mobile: this.tel,
          appointment_time: this.yyTime } }).

      then(function (res) {
        uni.hideLoading();
        if (res.data.code == 0) {
          uni.showToast({
            title: res.data.result.notice,
            mask: true,
            icon: 'none' });

          _this6.layerType = -1;
        }
      }).catch(function () {
        uni.hideLoading();
      });
    } } };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ "./node_modules/@dcloudio/uni-mp-weixin/dist/index.js")["default"]))

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/vue-loader/lib/index.js?!G:\\小程序\\bld-me\\pages\\mall\\newcar-detail\\newcar-detail.vue?vue&type=style&index=0&lang=scss&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-1!./node_modules/css-loader??ref--8-oneOf-1-2!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/vue-loader/lib??vue-loader-options!G:/小程序/bld-me/pages/mall/newcar-detail/newcar-detail.vue?vue&type=style&index=0&lang=scss& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib/index.js?!G:\\小程序\\bld-me\\pages\\mall\\newcar-detail\\newcar-detail.vue?vue&type=template&id=f317be62&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!G:/小程序/bld-me/pages/mall/newcar-detail/newcar-detail.vue?vue&type=template&id=f317be62& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var g0 = /^1[3456789]\d{9}$/.test(_vm.tel)
  var g1 = /^1[3456789]\d{9}$/.test(_vm.tel)
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        g1: g1
      }
    }
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "G:\\小程序\\bld-me\\pages\\mall\\newcar-detail\\newcar-detail.vue":
/*!****************************************************************!*\
  !*** G:/小程序/bld-me/pages/mall/newcar-detail/newcar-detail.vue ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _newcar_detail_vue_vue_type_template_id_f317be62___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./newcar-detail.vue?vue&type=template&id=f317be62& */ "G:\\小程序\\bld-me\\pages\\mall\\newcar-detail\\newcar-detail.vue?vue&type=template&id=f317be62&");
/* harmony import */ var _newcar_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./newcar-detail.vue?vue&type=script&lang=js& */ "G:\\小程序\\bld-me\\pages\\mall\\newcar-detail\\newcar-detail.vue?vue&type=script&lang=js&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _newcar_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _newcar_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _newcar_detail_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./newcar-detail.vue?vue&type=style&index=0&lang=scss& */ "G:\\小程序\\bld-me\\pages\\mall\\newcar-detail\\newcar-detail.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _newcar_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _newcar_detail_vue_vue_type_template_id_f317be62___WEBPACK_IMPORTED_MODULE_0__["render"],
  _newcar_detail_vue_vue_type_template_id_f317be62___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "G:/小程序/bld-me/pages/mall/newcar-detail/newcar-detail.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "G:\\小程序\\bld-me\\pages\\mall\\newcar-detail\\newcar-detail.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************!*\
  !*** G:/小程序/bld-me/pages/mall/newcar-detail/newcar-detail.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _E_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!./newcar-detail.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib/index.js?!G:\\小程序\\bld-me\\pages\\mall\\newcar-detail\\newcar-detail.vue?vue&type=script&lang=js&");
/* harmony import */ var _E_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_E_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _E_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _E_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_E_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "G:\\小程序\\bld-me\\pages\\mall\\newcar-detail\\newcar-detail.vue?vue&type=style&index=0&lang=scss&":
/*!**************************************************************************************************!*\
  !*** G:/小程序/bld-me/pages/mall/newcar-detail/newcar-detail.vue?vue&type=style&index=0&lang=scss& ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _E_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_E_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_E_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_E_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-1!./node_modules/css-loader??ref--8-oneOf-1-2!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/vue-loader/lib??vue-loader-options!./newcar-detail.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/mini-css-extract-plugin/dist/loader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/vue-loader/lib/index.js?!G:\\小程序\\bld-me\\pages\\mall\\newcar-detail\\newcar-detail.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _E_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_E_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_E_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_E_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_E_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_E_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_E_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_E_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _E_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_E_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_E_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_E_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _E_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_E_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_E_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_E_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_E_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_E_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_E_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_E_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "G:\\小程序\\bld-me\\pages\\mall\\newcar-detail\\newcar-detail.vue?vue&type=template&id=f317be62&":
/*!***********************************************************************************************!*\
  !*** G:/小程序/bld-me/pages/mall/newcar-detail/newcar-detail.vue?vue&type=template&id=f317be62& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_template_id_f317be62___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!./newcar-detail.vue?vue&type=template&id=f317be62& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib/index.js?!G:\\小程序\\bld-me\\pages\\mall\\newcar-detail\\newcar-detail.vue?vue&type=template&id=f317be62&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_template_id_f317be62___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_E_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_E_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_newcar_detail_vue_vue_type_template_id_f317be62___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

},[["G:\\小程序\\bld-me\\main.js?{\"page\":\"pages%2Fmall%2Fnewcar-detail%2Fnewcar-detail\"}","common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mall/newcar-detail/newcar-detail.js.map