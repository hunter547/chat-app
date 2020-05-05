import * as React from 'react'
import { StyleSheet } from 'react-native'
import Svg, { Path, Text } from 'react-native-svg'
import * as Font from 'expo-font'

function SvgComponent(props) {
  return (
    <Svg height='100' width='150' viewBox='0 0 36 36'>
      <Path
        d='M18 2.084a15.915 15.915 0 010 31.831 15.915 15.915 0 010-31.83'
        fill='none'
        stroke='#D3D3D3'
        strokeWidth='2'
      />
      <Path
        d='M18 2.084a15.915 15.915 0 010 31.831 15.915 15.915 0 010-31.83'
        fill='none'
        stroke='#4CC790'
        strokeWidth='1'
        strokeDasharray={props.percentage + ', 100'}
      />
      <Text x='11.5' y='20'
       fill='#fff'
       style={styles.text}>{props.percentage}%</Text>
    </Svg>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 5,
    textAlign: 'center'
  }
})

export default SvgComponent