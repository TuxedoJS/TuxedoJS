'use strict';

jest.dontMock('tuxx/React');
jest.dontMock('tuxx/Animations');
jest.dontMock('tuxx/src/TuxxAnimations');
jest.dontMock('tuxx/Animations/Fade');
jest.dontMock('tuxx/Animations/Fly');
jest.dontMock('tuxx/Animations/Zoom');
jest.dontMock('tuxx/Animations/Rotate');

describe('Animations', function () {
  var React, createAnimation, Idea, Fade, Fly, Zoom, Rotate, TestUtils, ideaComponent, mocks;

  beforeEach(function () {
    //Reset animation components and modules before each test
    React = require('tuxx/React');
    createAnimation = require('tuxx/Animations').createAnimation;
    Idea = require('tuxx/src/__tests__/testComponents');
    Fade = require('tuxx/Animations/Fade');
    Fly = require('tuxx/Animations/Fly');
    Zoom = require('tuxx/Animations/Zoom');
    Rotate = require('tuxx/Animations/Rotate');
    TransitionGroup = require('tuxx/React/TransitionGroup');

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
      <Fly id='id' />
    );
    //Need to use setProps here to pass in the component as a child of the animation component
    ideaFlyComponent.setProps({children: <Idea idea={mocks.ideas[0]} />});
    var ideaFly = TestUtils.findRenderedDOMComponentWithClass(ideaFlyComponent, 'fly');
    expect(ideaFly).toBeDefined();
  });

  it("applies a class of 'fade' for a fade transition", function () {
    ideaFadeComponent = TestUtils.renderIntoDocument(
      <Fade id={['id']} />
    );
    ideaFadeComponent.setProps({children: <Idea idea={mocks.ideas[0]} />});
    var ideaFade = TestUtils.findRenderedDOMComponentWithClass(ideaFadeComponent, 'fade');
    expect(ideaFade).toBeDefined();
  });

  it("applies a class of 'zoom' for a zoom transition", function () {
    ideaZoomComponent = TestUtils.renderIntoDocument(
      <Zoom id={['idea', 'id']} />
    );
    ideaZoomComponent.setProps({children: <Idea idea={mocks.ideas[0]} />});
    var ideaZoom = TestUtils.findRenderedDOMComponentWithClass(ideaZoomComponent, 'zoom');
    expect(ideaZoom).toBeDefined();
  });

  it("applies a class of 'rotate' for a rotate transition", function () {
    ideaRotateComponent = TestUtils.renderIntoDocument(
      <Rotate />
    );
    ideaRotateComponent.setProps({children: <Idea idea={mocks.ideas[0]} />});
    var ideaRotate = TestUtils.findRenderedDOMComponentWithClass(ideaRotateComponent, 'rotate');
    expect(ideaRotate).toBeDefined();
  });

  it("applies a class of 'myFade' for a myFade transition", function () {
    var MyFade = createAnimation(Fade, 'myFade');
    ideaMyFadeComponent = TestUtils.renderIntoDocument(
      <MyFade />
    );
    ideaMyFadeComponent.setProps({children: <Idea idea={mocks.ideas[0]} />});
    var ideaMyFade = TestUtils.findRenderedDOMComponentWithClass(ideaMyFadeComponent, 'myFade');
    expect(ideaMyFade).toBeDefined();
  });
});
