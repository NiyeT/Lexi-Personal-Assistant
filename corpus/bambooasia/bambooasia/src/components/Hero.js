import React, { Component } from 'react'
import Img from 'gatsby-image'
import styled from 'styled-components'
import Slider from './Slider'

const Wrapper = styled.section`
  position: relative;
  min-height: 300px;
`
const BgImg = styled(Img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
  min-height: 300px;
  height: 300px;
  @media (min-width: ${props => props.theme.responsive.small}) {
    height: ${props => props.height || '300px'};
  }
  & > img {
    object-fit: ${props => props.fit || 'cover'} !important;
    object-position: ${props => props.position || '50% 50%'} !important;
  }
  &::before {
    content: '';
    background: rgba(0, 0, 0, 0.25);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
  }
`

const Title = styled.h1`
  font-size: 3em;
  text-transform: capitalize;
  font-weight: 600;
  position: absolute;
  width: 100%;
  max-width: ${props => props.theme.sizes.maxWidthCentered};
  padding: 0 1rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
`

export default class Hero extends Component {
  render() {
    // Deconstruct data from props
    const { data } = this.props
    // if data does not exist then return null to avoid errors
    if (!data) return null
    // console.log('hero data: ', data);

    // deconstruct out the contentful data attributes and objects
    const {
      image,
      title,
      slideshow,
    } = data

    if(slideshow) {
      return <Slider data={slideshow}/>
    }

    return (
      <Wrapper>
        <BgImg
          fluid={image.fluid}
          backgroundColor={'#eeeeee'}
        />
        <Title>{title}</Title>
      </Wrapper>
    )
  }
}
