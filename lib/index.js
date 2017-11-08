'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('./array-findindex');

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _support = require('./support.js');

var _support2 = _interopRequireDefault(_support);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var roundToNearest = function roundToNearest(size, precision) {
  return precision * Math.ceil(size / precision);
};

var isStringNotEmpty = function isStringNotEmpty(str) {
  return str && typeof str === 'string' && str.length > 0;
};
var buildKey = function buildKey(idx) {
  return 'react-imgix-' + idx;
};

var validTypes = ['bg', 'img', 'picture', 'source'];

var defaultMap = {
  width: 'defaultWidth',
  height: 'defaultHeight'
};

var findSizeForDimension = function findSizeForDimension(dim) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (props[dim]) {
    return props[dim];
  } else if (props.fluid && state[dim]) {
    return roundToNearest(state[dim], props.precision);
  } else if (props[defaultMap[dim]]) {
    return props[defaultMap[dim]];
  } else {
    return 1;
  }
};

var ReactImgix = function (_Component) {
  _inherits(ReactImgix, _Component);

  function ReactImgix() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ReactImgix);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReactImgix.__proto__ || Object.getPrototypeOf(ReactImgix)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      width: null,
      height: null,
      mounted: false
    }, _this.forceLayout = function () {
      var node = _reactDom2.default.findDOMNode(_this);
      _this.setState({
        width: node.scrollWidth,
        height: node.scrollHeight,
        mounted: true
      });
      _this.props.onMounted(node);
    }, _this.componentDidMount = function () {
      _this.forceLayout();
    }, _this._findSizeForDimension = function (dim) {
      return findSizeForDimension(dim, _this.props, _this.state);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ReactImgix, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          aggressiveLoad = _props.aggressiveLoad,
          auto = _props.auto,
          bg = _props.bg,
          children = _props.children,
          component = _props.component,
          customParams = _props.customParams,
          crop = _props.crop,
          entropy = _props.entropy,
          faces = _props.faces,
          fit = _props.fit,
          generateSrcSet = _props.generateSrcSet,
          src = _props.src,
          type = _props.type,
          other = _objectWithoutProperties(_props, ['aggressiveLoad', 'auto', 'bg', 'children', 'component', 'customParams', 'crop', 'entropy', 'faces', 'fit', 'generateSrcSet', 'src', 'type']);

      var _src = null;
      var srcSet = null;
      var _component = component;

      var width = this._findSizeForDimension('width');
      var height = this._findSizeForDimension('height');

      var _crop = false;
      if (faces) _crop = 'faces';
      if (entropy) _crop = 'entropy';
      if (crop) _crop = crop;

      var _fit = false;
      if (entropy) _fit = 'crop';
      if (fit) _fit = fit;

      var _children = children;

      if (this.state.mounted || aggressiveLoad) {
        var srcOptions = _extends({
          auto: auto
        }, customParams, {
          crop: _crop,
          fit: _fit,
          width: width,
          height: height
        });

        _src = (0, _support2.default)(src, srcOptions);
        var dpr2 = (0, _support2.default)(src, _extends({}, srcOptions, { dpr: 2 }));
        var dpr3 = (0, _support2.default)(src, _extends({}, srcOptions, { dpr: 3 }));
        srcSet = dpr2 + ' 2x, ' + dpr3 + ' 3x';
      }

      var childProps = _extends({}, this.props.imgProps, {
        className: this.props.className,
        width: other.width <= 1 ? null : other.width,
        height: other.height <= 1 ? null : other.height
      });

      switch (type) {
        case 'bg':
          if (!component) {
            _component = 'div';
          }
          childProps.style = _extends({
            backgroundSize: 'cover',
            backgroundImage: isStringNotEmpty(_src) ? 'url(\'' + _src + '\')' : null
          }, childProps.style);
          break;
        case 'img':
          if (!component) {
            _component = 'img';
          }

          if (generateSrcSet) {
            childProps.srcSet = srcSet;
          }
          childProps.src = _src;
          break;
        case 'source':
          if (!component) {
            _component = 'source';
          }

          // strip out the "alt" tag from childProps since it's not allowed
          delete childProps.alt;

          // inside of a <picture> element a <source> element ignores its src
          // attribute in favor of srcSet so we set that with either an actual
          // srcSet or a single src
          if (generateSrcSet) {
            childProps.srcSet = _src + ', ' + srcSet;
          } else {
            childProps.srcSet = _src;
          }
          // for now we'll take media from imgProps which isn't ideal because
          //   a) this isn't an <img>
          //   b) passing objects as props means that react will always rerender
          //      since objects dont respond correctly to ===
          break;
        case 'picture':
          if (!component) {
            _component = 'picture';
          }

          // strip out the "alt" tag from childProps since it's not allowed
          delete childProps.alt;

          //
          // we need to make sure an img is the last child so we look for one
          //    in children
          //    a. if we find one, move it to the last entry if it's not already there
          //    b. if we don't find one, create one.

          // make sure all of our children have key set, otherwise we get react warnings
          _children = _react2.default.Children.map(children, function (child, idx) {
            return _react2.default.cloneElement(child, { key: buildKey(idx) });
          }) || [];

          // look for an <img> or <ReactImgix type='img'> - at the bare minimum we
          // have to have a single <img> element or else ie will not work.
          var imgIdx = _children.findIndex(function (c) {
            return c.type === 'img' || c.type === ReactImgix && c.props.type === 'img';
          });

          if (imgIdx === -1) {
            // didn't find one or empty array - either way make a new component to
            // put at the end. we pass in almost all of our props as defaults to
            // our children, exceptions are:
            //
            //    bg - only <source> and <img> elements are allowable as children of
            //         <picture> so we strip this option
            //    children - we don't want to get recursive here
            //    component - same reason as bg
            //    type - specifically we're adding an img type so we hard-code this,
            //           also letting type=picture through would infinitely loop

            var imgProps = _extends({
              aggressiveLoad: aggressiveLoad,
              auto: auto,
              customParams: customParams,
              crop: crop,
              entropy: entropy,
              faces: faces,
              fit: fit,
              generateSrcSet: generateSrcSet,
              src: src,
              type: 'img'
            }, other, {
              // make sure to set a unique key too
              key: buildKey(_children.length + 1)
            });

            // we also remove className and styles if they exist - those passed in
            // to our top-level component are set there, if you want them set on
            // the child <img> element you can use `imgProps`.
            delete imgProps.className;
            delete imgProps.styles;

            // ..except if you have passed in imgProps you need those to not disappear,
            // so we'll remove the imgProps attribute from our imgProps object (ugh!)
            // and apply them now:
            imgProps.imgProps = _extends({}, this.props.imgProps);
            ['className', 'styles'].forEach(function (k) {
              if (imgProps.imgProps[k]) {
                imgProps[k] = imgProps.imgProps[k];
                delete imgProps.imgProps[k];
              }
            });

            // have to strip out props set to undefined or empty objects since they
            // will override any defaultProps in the child
            Object.keys(imgProps).forEach(function (k) {
              if (imgProps[k] === undefined || Object.keys(imgProps[k]).length === 0 && imgProps[k].constructor === Object) delete imgProps[k];
            });

            _children.push(_react2.default.createElement(ReactImgix, imgProps));
          } else if (imgIdx !== _children.length - 1) {
            // found one, need to move it to the end
            _children.splice(_children.length - 1, 0, _children.splice(imgIdx, 1)[0]);
          }
          break;
        default:
          break;
      }
      return _react2.default.createElement(_component, childProps, _children);
    }
  }]);

  return ReactImgix;
}(_react.Component);

ReactImgix.propTypes = {
  aggressiveLoad: _propTypes2.default.bool,
  auto: _propTypes2.default.array,
  children: _propTypes2.default.any,
  className: _propTypes2.default.string,
  component: _propTypes2.default.string,
  crop: _propTypes2.default.string,
  customParams: _propTypes2.default.object,
  entropy: _propTypes2.default.bool,
  faces: _propTypes2.default.bool,
  fit: _propTypes2.default.string,
  fluid: _propTypes2.default.bool,
  generateSrcSet: _propTypes2.default.bool,
  onMounted: _propTypes2.default.func,
  src: _propTypes2.default.string.isRequired,
  type: _propTypes2.default.oneOf(validTypes)
};
ReactImgix.defaultProps = {
  aggressiveLoad: false,
  auto: ['format'],
  entropy: false,
  faces: true,
  fit: 'crop',
  fluid: true,
  generateSrcSet: true,
  onMounted: function onMounted() {},
  precision: 100,
  type: 'img'
};
exports.default = ReactImgix;