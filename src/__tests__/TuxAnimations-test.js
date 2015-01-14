'use strict';

jest.dontMock('tux/React');
jest.dontMock('tux/Animations');
jest.dontMock('tux/src/TuxAnimations');
jest.dontMock('tux/Animations/Fade');
jest.dontMock('tux/Animations/Fly');
jest.dontMock('tux/Animations/Zoom');
jest.dontMock('tux/Animations/Rotate');

describe('Animations', function () {
  var React, createAnimation, Idea, Fade, Fly, Zoom, Rotate, TestUtils, ideaComponent, mocks;

  beforeEach(function () {
    //Reset animation components and modules before each test
    React = require('tux/React');
    createAnimation = require('tux/Animations').createAnimation;
    Idea = require('./testComponents');
    Fade = require('tux/Animations/Fade');
    Fly = require('tux/Animations/Fly');
    Zoom = require('tux/Animations/Zoom');
    Rotate = require('tux/Animations/Rotate');
    TransitionGroup = require('tux/React/TransitionGroup');

    TestUtils = require('react/lib/ReactTestUtils');
    TestUtils.mockComponent(TransitionGroup);
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
      <Fly key={mocks.ideas[0].id} />
    );
    //Need to use setProps here to pass in the component as a child of the animation component
    ideaFlyComponent.setProps({children: <Idea key={mocks.ideas[0].id} />})
    var ideaFly = TestUtils.findRenderedDOMComponentWithClass(ideaFlyComponent, 'fly');
    expect(ideaFly).toBeDefined();
  });

  it("applies a class of 'fade' for a fade transition", function () {
    ideaFadeComponent = TestUtils.renderIntoDocument(
      <Fade key={mocks.ideas[0].id} />
    );
    ideaFadeComponent.setProps({children: <Idea key={mocks.ideas[0].id} />})
    var ideaFade = TestUtils.findRenderedDOMComponentWithClass(ideaFadeComponent, 'fade');
    expect(ideaFade).toBeDefined();
  });

  it("applies a class of 'zoom' for a zoom transition", function () {
    ideaZoomComponent = TestUtils.renderIntoDocument(
      <Zoom key={mocks.ideas[0].id} />
    );
    ideaZoomComponent.setProps({children: <Idea key={mocks.ideas[0].id} />})
    var ideaZoom = TestUtils.findRenderedDOMComponentWithClass(ideaZoomComponent, 'zoom');
    expect(ideaZoom).toBeDefined();
  });

  it("applies a class of 'rotate' for a rotate transition", function () {
    ideaRotateComponent = TestUtils.renderIntoDocument(
      <Rotate key={mocks.ideas[0].id} />
    );
    ideaRotateComponent.setProps({children: <Idea key={mocks.ideas[0].id} />})
    var ideaRotate = TestUtils.findRenderedDOMComponentWithClass(ideaRotateComponent, 'rotate');
    expect(ideaRotate).toBeDefined();
  });

  it("applies a class of 'myFade' for a myFade transition", function () {
    var MyFade = createAnimation(Fade, 'myFade');
    ideaMyFadeComponent = TestUtils.renderIntoDocument(
      <MyFade key={mocks.ideas[0].id} />
    );
    ideaMyFadeComponent.setProps({children: <Idea key={mocks.ideas[0].id} />})
    var ideaMyFade = TestUtils.findRenderedDOMComponentWithClass(ideaMyFadeComponent, 'myFade');
    expect(ideaMyFade).toBeDefined();
  });
});
