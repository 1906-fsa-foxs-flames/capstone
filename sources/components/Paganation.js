import React, { Component } from 'react'
import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import {Card, ListItem } from 'react-native-elements'


export default class Paganation extends Component {
  constructor(props){
    super(props);
    this.state= {
      carouselItems:[
        {train:this.props.trains}
      ]
    }
  }

  _renderItem({item,index}){
    console.log(item.train)
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>                 
            <Card style={{color:'#fff'}} title='Next Trains'><Text>{item.train.map((x, i) => <ListItem key={i} title={x} />)}</Text></Card>
        </View>
    )
}

render() {
    return (
    <SafeAreaView style={styles.container}>


      
        <Carousel
                data={this.state.carouselItems}
                sliderWidth={250}
                itemWidth={250}
                renderItem={this._renderItem}
            />
       

    </SafeAreaView>
    );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#131420',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

