'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* global describe it beforeEach afterEach console */

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _expectJsx = require('expect-jsx');

var _expectJsx2 = _interopRequireDefault(_expectJsx);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _skinDeep = require('skin-deep');

var _skinDeep2 = _interopRequireDefault(_skinDeep);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_expect2.default.extend(_expectJsx2.default);

var src = 'http://domain.imgix.net/image.jpg';
var tree = void 0,
    vdom = void 0,
    instance = void 0; // eslint-disable-line no-unused-vars

describe('<img> mode', function () {
  beforeEach(function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, aggressiveLoad: true }));
    vdom = tree.getRenderOutput();
    instance = tree.getMountedInstance();
  });

  it('should render an image', function () {
    (0, _expect2.default)(vdom.type).toBe('img');
  });
  it('should have a src tag', function () {
    (0, _expect2.default)(vdom.props.src).toInclude(src);
  });
});
// These tests emulate the pre-mount state as `tree.getMountedInstance()` isn't called
describe('<img> type - pre-mount', function () {
  beforeEach(function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { type: 'img', src: src }));
    vdom = tree.getRenderOutput();
  });
  it("shouldn't have a blank src tag", function () {
    (0, _expect2.default)(vdom.props.src).toBe(null);
    (0, _expect2.default)(vdom.props.srcSet).toBe(null);
  });
});

describe('default type', function () {
  it('should be img', function () {
    var component = _react2.default.createElement(_index2.default, { src: src });
    (0, _expect2.default)(component.props.type).toBe('img');
  });
});

describe('<source> type', function () {
  // verify that these will make it through
  var imgProps = {
    media: '(min-width: 1200px)',
    sizes: '(max-width: 30em) 100vw, (max-width: 50em) 50vw, calc(33vw - 100px)',
    type: 'image/webp',
    alt: 'alt text'
  };
  var shouldBehaveLikeSource = function shouldBehaveLikeSource() {
    it('should render a source', function () {
      (0, _expect2.default)(vdom.type).toBe('source');
    });

    it('should have a srcSet prop', function () {
      (0, _expect2.default)(vdom.props.srcSet).toExist();
    });

    Object.keys(imgProps).filter(function (k) {
      return k !== 'alt';
    }).forEach(function (k) {
      it('should have props.' + k + ' set', function () {
        (0, _expect2.default)(vdom.props[k]).toBe(imgProps[k]);
      });
    });
    it('should not have props.alt set', function () {
      (0, _expect2.default)(vdom.props.alt).toBe(undefined);
    });
  };

  describe('with generateSrcSet', function () {
    beforeEach(function () {
      tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, type: 'source', generateSrcSet: true, aggressiveLoad: true, imgProps: imgProps }));
      vdom = tree.getRenderOutput();
      instance = tree.getMountedInstance();
    });

    shouldBehaveLikeSource();
    it('should have props.srcSet set to a valid src', function () {
      (0, _expect2.default)(vdom.props.srcSet).toInclude(src);
      (0, _expect2.default)(vdom.props.srcSet).toInclude('2x');
    });
  });

  describe('without generateSrcSet', function () {
    beforeEach(function () {
      tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, type: 'source', generateSrcSet: false, aggressiveLoad: true, imgProps: imgProps }));
      vdom = tree.getRenderOutput();
      instance = tree.getMountedInstance();
    });
    shouldBehaveLikeSource();
    it('should have props.srcSet set to src', function () {
      (0, _expect2.default)(vdom.props.srcSet).toMatch(new RegExp('^' + src));
    });
  });
});

describe('<picture> type', function () {
  var children = void 0,
      lastChild = void 0;
  var parentAlt = 'parent alt';
  var childAlt = 'child alt';

  var shouldBehaveLikePicture = function shouldBehaveLikePicture() {
    it('should have key set on every child', function () {
      (0, _expect2.default)(children.every(function (c) {
        return c.key !== undefined;
      })).toBe(true);
    });

    it('should render a picture', function () {
      (0, _expect2.default)(vdom.type).toBe('picture');
    });

    it('should not have an alt tag', function () {
      (0, _expect2.default)(vdom.alt).toBe(undefined);
    });

    it('should have either an <img> or a <ReactImgix type=img> as its last child', function () {
      if (lastChild.type.hasOwnProperty('name')) {
        (0, _expect2.default)(lastChild.type.name).toBe('ReactImgix');
        (0, _expect2.default)(lastChild.props.type).toBe('img');
      } else {
        (0, _expect2.default)(lastChild.type).toBe('img');
      }
    });
  };

  describe('with no children', function () {
    var imgProps = { className: 'foobar', alt: parentAlt };
    beforeEach(function () {
      tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, type: 'picture', agressiveLoad: true, imgProps: imgProps }));
      vdom = tree.getRenderOutput();
      instance = tree.getMountedInstance();
      children = vdom.props.children;
      lastChild = children[children.length - 1];
    });

    shouldBehaveLikePicture();

    it('should only have one child', function () {
      (0, _expect2.default)(children.length).toBe(1);
    });

    it('should pass props down to automatically added type=img', function () {
      // todo - verify all valid props are passed down to children as defaults
      // except for the ones we specifically exclude
      var expectedProps = _extends({}, instance.props, { type: 'img' }, { imgProps: imgProps });
      expectedProps.className = expectedProps.imgProps.className;
      delete expectedProps.bg;
      delete expectedProps.children;
      delete expectedProps.component;
      delete expectedProps.imgProps.className;
      (0, _expect2.default)(lastChild.props).toEqual(expectedProps);
    });
  });

  describe('with a <ReactImgix type=img> as a child', function () {
    beforeEach(function () {
      tree = _skinDeep2.default.shallowRender(_react2.default.createElement(
        _index2.default,
        { src: src, type: 'picture', agressiveLoad: true, faces: false, entropy: true, imgProps: { alt: parentAlt } },
        _react2.default.createElement(_index2.default, { src: src, type: 'img', imgProps: { alt: childAlt } })
      ));
      vdom = tree.getRenderOutput();
      instance = tree.getMountedInstance();
      children = vdom.props.children;
      lastChild = children[children.length - 1];
    });

    shouldBehaveLikePicture();
    it('should only have one child', function () {
      (0, _expect2.default)(children.length).toBe(1);
    });
    it('should not pass props down to children', function () {
      (0, _expect2.default)(lastChild.props.faces).toBe(true);
      (0, _expect2.default)(lastChild.props.entropy).toBe(false);
      (0, _expect2.default)(lastChild.props.imgProps.alt).toEqual(childAlt);
    });
  });

  describe('with an <img> as a child', function () {
    beforeEach(function () {
      tree = _skinDeep2.default.shallowRender(_react2.default.createElement(
        _index2.default,
        { src: src, type: 'picture', agressiveLoad: true, faces: false, entropy: true, imgProps: { alt: parentAlt } },
        _react2.default.createElement('img', { src: src, alt: childAlt })
      ));
      vdom = tree.getRenderOutput();
      instance = tree.getMountedInstance();
      children = vdom.props.children;
      lastChild = children[children.length - 1];
    });

    shouldBehaveLikePicture();
    it('should only have one child', function () {
      (0, _expect2.default)(children.length).toBe(1);
    });
    it('should not pass props down to children', function () {
      (0, _expect2.default)(lastChild.props.faces).toBe(undefined);
      (0, _expect2.default)(lastChild.props.entropy).toBe(undefined);
      (0, _expect2.default)(lastChild.props.alt).toEqual(childAlt);
    });
  });
});

var shouldBehaveLikeBg = function shouldBehaveLikeBg() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'cover';

  it('should render a div', function () {
    (0, _expect2.default)(vdom.type).toBe('div');
  });
  it('should have the appropriate styles', function () {
    (0, _expect2.default)(vdom.props.style.backgroundImage).toInclude(src);
    (0, _expect2.default)(vdom.props.style.backgroundSize).toBe(size);
  });
};

describe('background type', function () {
  beforeEach(function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, type: 'bg', aggressiveLoad: true }));
    vdom = tree.getRenderOutput();
    instance = tree.getMountedInstance();
  });
  shouldBehaveLikeBg();
});

describe('background type without backgroundSize', function () {
  beforeEach(function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, type: 'bg', imgProps: { style: { backgroundSize: null } }, aggressiveLoad: true }));
    vdom = tree.getRenderOutput();
    instance = tree.getMountedInstance();
  });
  shouldBehaveLikeBg(null);
});

describe('background type with background contain', function () {
  beforeEach(function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, type: 'bg', imgProps: { style: { backgroundSize: 'contain' } }, aggressiveLoad: true }));
    vdom = tree.getRenderOutput();
    instance = tree.getMountedInstance();
  });
  shouldBehaveLikeBg('contain');
});

// These tests emulate the pre-mount state as `tree.getMountedInstance()` isn't called
describe('background mode - pre-mount', function () {
  beforeEach(function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, type: 'bg' }));
    vdom = tree.getRenderOutput();
  });
  it('should not have an empty url()', function () {
    (0, _expect2.default)(vdom.props.style.backgroundImage).toBe(null);
    (0, _expect2.default)(vdom.props.style.backgroundSize).toBe('cover');
  });
});
describe('custom component', function () {
  beforeEach(function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, component: 'li', type: 'bg', aggressiveLoad: true }));
    vdom = tree.getRenderOutput();
    instance = tree.getMountedInstance();
  });
  it('should render the custom component', function () {
    (0, _expect2.default)(vdom.props.style.backgroundImage).toInclude(src);
    (0, _expect2.default)(vdom.type).toBe('li');
  });
});
describe('image props', function () {
  var className = 'img--enabled';
  beforeEach(function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, auto: ['format', 'enhance'], className: className, aggressiveLoad: true, faces: true }));
    vdom = tree.getRenderOutput();
    instance = tree.getMountedInstance();
  });
  it('auto prop', function () {
    (0, _expect2.default)(vdom.props.src).toInclude('auto=format%2Cenhance');
  });
  it('className prop', function () {
    (0, _expect2.default)(vdom.props.className).toInclude(className);
  });
  it('crop prop', function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, aggressiveLoad: true, crop: 'faces,entropy' }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.src).toInclude('crop=faces%2Centropy');
    (0, _expect2.default)(vdom.props.src).toInclude('fit=crop');
  });
  it('crop prop overrides faces prop', function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, aggressiveLoad: true, faces: true, crop: 'faces,entropy' }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.src).toInclude('crop=faces%2Centropy');
    (0, _expect2.default)(vdom.props.src).toInclude('fit=crop');
  });
  it('crop prop overrides entropy prop', function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, aggressiveLoad: true, entropy: true, crop: 'faces,entropy' }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.src).toInclude('crop=faces%2Centropy');
    (0, _expect2.default)(vdom.props.src).toInclude('fit=crop');
  });
  it('faces prop', function () {
    (0, _expect2.default)(vdom.props.src).toInclude('crop=faces');
  });
  it('fit prop', function () {
    (0, _expect2.default)(vdom.props.src).toInclude('fit=crop');
  });
  it('entropy prop', function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, aggressiveLoad: true, entropy: true }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.src).toInclude('crop=entropy');
    (0, _expect2.default)(vdom.props.src).toInclude('fit=crop');
  });
  it('url encodes param keys', function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, {
      src: 'https://mysource.imgix.net/demo.png',
      aggressiveLoad: true,
      customParams: {
        'hello world': 'interesting'
      }
    }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.src).toEqual('https://mysource.imgix.net/demo.png?auto=format&dpr=1&hello%20world=interesting&crop=faces&fit=crop&w=1&h=1');
  });
  it('url encodes param values', function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, {
      src: 'https://mysource.imgix.net/demo.png',
      aggressiveLoad: true,
      customParams: {
        hello_world: '/foo"> <script>alert("hacked")</script><'
      }
    }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.src).toEqual('https://mysource.imgix.net/demo.png?auto=format&dpr=1&hello_world=%2Ffoo%22%3E%20%3Cscript%3Ealert(%22hacked%22)%3C%2Fscript%3E%3C&crop=faces&fit=crop&w=1&h=1');
  });
  it('Base64 encodes Base64 param variants', function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, {
      src: 'https://mysource.imgix.net/~text',
      aggressiveLoad: true,
      customParams: {
        txt64: 'I cannøt belîév∑ it wors! 😱'
      }
    }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.src).toEqual('https://mysource.imgix.net/~text?auto=format&dpr=1&txt64=SSBjYW5uw7h0IGJlbMOuw6l24oiRIGl0IHdvcu-jv3MhIPCfmLE&crop=faces&fit=crop&w=1&h=1');
  });
  // it('fluid prop', () => {
  //   expect(vdom.props.src).to.include('auto=format,enhance')
  // })
  // it('precision prop', () => {
  //   expect(vdom.props.src).to.include('auto=format,enhance')
  // })
  // it.skip('custom props', () => {
  //   expect(vdom.props.src).to.include('auto=format,enhance')
  // })
  it('generateSrcSet prop', function () {
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: src, aggressiveLoad: true, generateSrcSet: true }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.srcSet).toInclude('dpr=2');
    (0, _expect2.default)(vdom.props.srcSet).toInclude('dpr=3');
  });
  it('height passed to url param', function () {
    var height = 300;
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: 'https://mysource.imgix.net/demo.png', aggressiveLoad: true, height: height }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.src).toEqual('https://mysource.imgix.net/demo.png?auto=format&dpr=1&crop=faces&fit=crop&w=1&h=' + height);
  });

  it('height between 0 and 1 not passed to childProps', function () {
    var height = 0.5;
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: 'https://mysource.imgix.net/demo.png', aggressiveLoad: true, height: height }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.height).toBeFalsy();
  });

  it('height greater than 1 passed to childProps', function () {
    var height = 300;
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: 'https://mysource.imgix.net/demo.png', aggressiveLoad: true, height: height }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.height).toEqual(height);
  });

  it('width passed to url param', function () {
    var width = 300;
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: 'https://mysource.imgix.net/demo.png', aggressiveLoad: true, width: width }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.src).toEqual('https://mysource.imgix.net/demo.png?auto=format&dpr=1&crop=faces&fit=crop&w=' + width + '&h=1');
  });

  it('width between 0 and 1 not passed to childProps', function () {
    var width = 0.5;
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: 'https://mysource.imgix.net/demo.png', aggressiveLoad: true, width: width }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.width).toBeFalsy();
  });

  it('width greater than 1 passed to childProps', function () {
    var width = 300;
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: 'https://mysource.imgix.net/demo.png', aggressiveLoad: true, width: width }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.width).toEqual(width);
  });

  it('accepts any prop passed to imgProps', function () {
    var imgProps = {
      alt: 'Example alt attribute',
      'data-src': 'https://mysource.imgix.net/demo.png'
    };
    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: 'https://mysource.imgix.net/demo.png', imgProps: imgProps }));
    vdom = tree.getRenderOutput();

    (0, _expect2.default)(vdom.props.alt).toEqual(imgProps.alt);
    (0, _expect2.default)(vdom.props['data-src']).toEqual(imgProps['data-src']);
  });

  it('onMounted callback is called', function () {
    var onMountedSpy = _sinon2.default.spy();
    var mockImage = _react2.default.createElement('img', null);

    tree = _skinDeep2.default.shallowRender(_react2.default.createElement(_index2.default, { src: 'https://mysource.imgix.net/demo.png', onMounted: onMountedSpy }));
    instance = tree.getMountedInstance();
    _sinon2.default.stub(_reactDom2.default, 'findDOMNode').callsFake(function () {
      return mockImage;
    });
    instance.componentDidMount();

    _sinon2.default.assert.calledWith(onMountedSpy, mockImage);

    _reactDom2.default.findDOMNode.restore();
  });
});