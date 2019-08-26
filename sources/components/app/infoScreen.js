/* eslint-disable complexity */
import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import styles from '../../variables/styles';
import TopToolBar from './topToolBar'
import axios from 'axios';

export default class InfoScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            subwayState: [],
            finalObject: {},
            effectiveDate: '',
        }
        this.getSubwayState = this.getSubwayState.bind(this);
        this.getInstantDate = this.getInstantDate.bind(this);
        this.getBgColor = this.getBgColor.bind(this);
        this.getTextColor = this.getTextColor.bind(this);
    }

    componentDidMount() {
        this.getSubwayState();
    }

    getSubwayState() {
        const promise = new Promise((resolve, reject) => {
            const result = axios.get('https://us-central1-subwar-a2611.cloudfunctions.net/getMTAState');
            resolve(result)
        });
        promise.then(
            result => { 
                this.setState({subwayState: result.data})
                let obj = {};
                this.state.subwayState.forEach(element => {
                    if (typeof element === 'object') {
                        obj[element.status] = {
                          trains: [],
                          timeStamp: ''
                        }
                    }
                })
                this.state.subwayState.forEach(element => {
                    let fromFunc = element.name === 'SIR' ? [element.name] : Array.from(element.name);
                    if (obj[element.status]) {
                      obj[element.status].trains = obj[element.status].trains.concat(fromFunc);
                      if (element.Date !== '') obj[element.status].timeStamp = element.Date + ' ' + element.Time;
                    }
                })
                this.setState({finalObject: obj})
            }
        );
        this.setState({effectiveDate: this.getInstantDate()});
    }

    getBgColor(train) {
        switch (train) {
            case '1':
            case '2':
            case '3':
                return 'red';
            case '4':
            case '5':
            case '6':
                return 'green';
            case '7':
                return 'violet';
            case 'A':
            case 'C':
            case 'E':
            case 'SIR':
                return 'blue';
            case 'B':
            case 'D':
            case 'F':
            case 'M':
                return 'orange';
            case 'G':
                return 'lightgreen';
            case 'J':
            case 'Z':
                return 'brown';
            case 'L':
            case 'S':
                return 'gray';
            case 'Q':
            case 'N':
            case 'R':
                return 'yellow'
            default:
                return 'black'
        }
    }

    getTextColor(train) {
        switch (train) {
            case 'Q':
            case 'N':
            case 'R':
                return 'black';
            default:
                return 'white';
        }
    }

    getInstantDate() {
        const date = new Date(Date.now());
        const day = ((1 + date.getMonth()) >= 10 ? 1 + date.getMonth() : '0' + (1 + date.getMonth())) + '/' + date.getDate() + '/' + date.getFullYear();
        const time = date.getHours() - 12 + ':' + date.getMinutes() + (date.getHours() >= 12 ? 'PM' : 'AM');
        return day + ' ' + time;
    }

    render() {
        const states = Object.keys(this.state.finalObject);
        return (
            <View style={styles.container}>
                <TopToolBar navigation={this.props.navigation} />
                <View style={styles.mainSpace}>
                <ScrollView>
                    {
                    states.map(state => {
                        return (
                            <View key={state} style={styles.infoContainer}>
                                <View
                                    style={{
                                        borderBottomColor: 'white',
                                        borderBottomWidth: 1,
                                        width: "90%",
                                        alignSelf: "center"
                                    }}
                                    />
                                <View style={styles.infoHeaderContainer}>
                                
                                    <Text style={styles.infoHeaderText}>{state + ' (' + (this.state.finalObject[state].timeStamp === '' 
                                                                        ? this.state.effectiveDate
                                                                        : this.state.finalObject[state].timeStamp) + ')'}
                                    </Text>
                                </View>
                                <View style={styles.infoTrainContainer}>
                                    {
                                        this.state.finalObject[state].trains.map(train => {
                                            return (
                                                <Text
                                                    key={train}
                                                    style={[styles.infoTrainText, {
                                                            backgroundColor: this.getBgColor(train), 
                                                            color: this.getTextColor(train)}]}>{train}
                                                </Text>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                        )
                    })
                    }
                </ScrollView>
                </View>
            </View>
        )
    }
}