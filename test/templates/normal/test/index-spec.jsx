import React from 'react';
import { shallow } from 'enzyme';
import Index from '../src/index';

describe('<Index />', () => {
  it('should render a span with text foo', () => {
    shallow(<Index />)
            .html().should.equal('<span>foo</span>');
  });
});
