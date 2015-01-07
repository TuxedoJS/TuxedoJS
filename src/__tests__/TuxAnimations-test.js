'use strict';

jest.dontMock('../TuxAnimations');
jest.dontMock('../../Animations/Fade');
jest.dontMock('../../Animations/Fly');
jest.dontMock('../../Animations/Zoom');

describe('Animations', function () {
  var React, makeAnimation, Idea, Fade, Fly, Zoom, TestUtils, ideaComponent, mocks;

  beforeEach(function () {
    //Reset animation components and modules before each test
    React = require('react/addons');
    makeAnimation = require('../TuxAnimations');
    Idea = require('./testComponents');
    Fade = require('../../Animations/Fade');
    Fly = require('../../Animations/Fly');
    Zoom = require('../../Animations/Zoom');
    TestUtils = React.addons.TestUtils;
    TestUtils.mockComponent(Idea);
    //Reset mocks before each test
    mocks = {
      ideas: [
        {
          id: 1,
          text: 'Save the world.'
        },
        {
          id: 2,
          text: 'More saving of the world.'
        }
      ]
    };
  });

  it("applies a class of 'fly' for a fly transition", function () {
    ideaFlyComponent = TestUtils.renderIntoDocument(
      <Fly key={mocks.ideas[0].id}>
        <Idea key={mocks.ideas[0].id} />
      </Fly>
    );
    var ideaFly = TestUtils.findRenderedDOMComponentWithClass(ideaFlyComponent, 'fly');
    expect(ideaFly).toBeDefined();
  });

  it("applies a class of 'fade' for a fade transition", function () {
    ideaFadeComponent = TestUtils.renderIntoDocument(
      <Fade key={mocks.ideas[1].id}>
        <Idea key={mocks.ideas[1].id} />
      </Fade>
    );
    var ideaFade = TestUtils.findRenderedDOMComponentWithClass(ideaFadeComponent, 'fade');
    expect(ideaFade).toBeDefined();
  });

  it("applies a class of 'zoom' for a zoom transition", function () {
    ideaZoomComponent = TestUtils.renderIntoDocument(
      <Zoom key={mocks.ideas[1].id}>
        <Idea key={mocks.ideas[1].id} />
      </Zoom>
    );
    var ideaZoom = TestUtils.findRenderedDOMComponentWithClass(ideaZoomComponent, 'zoom');
    expect(ideaZoom).toBeDefined();
  });

  it("applies the proper class when a second argument is passed in to the makeAnimation factory function", function () {
    var MyFade = makeAnimation(Fade, 'myFade');
    ideaFadeComponent = TestUtils.renderIntoDocument(
      <MyFade key={mocks.ideas[1].id}>
        <Idea key={mocks.ideas[1].id} />
      </MyFade>
    );
    var ideaFade = TestUtils.findRenderedDOMComponentWithClass(ideaFadeComponent, 'myFade');
    expect(ideaFade).toBeDefined();
  });
});
