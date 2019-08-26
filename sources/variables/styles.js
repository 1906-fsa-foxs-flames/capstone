/* eslint-disable linebreak-style */
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f61a9',
    },
    logoView: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 150,
        height: 150,
    },
    logiText: {
        color: '#fff',
        marginTop: 10,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        opacity: 0.8
    },
    inputText: {
        height: 40,
        width: 280,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 20,
        color: '#fff',
        fontSize: 16,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    buttonText: {
        color: '#fff',
        backgroundColor: '#2d98da',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
        margin: 8,
    },
    mainSpace: {
        flex: 12,
        alignItems: 'center',
        justifyContent: 'center',
      },
    toolsBar: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#0f61a9',
        marginTop: 24,
        width: '100%'
    },
    toolBarButton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    infoContainer: {
        flex: 1,
        backgroundColor: '#0f61a9',
    },
    infoHeaderContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    infoHeaderText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 5,
        margin: 5,
        alignSelf: 'center'
    },
    infoTrainContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    infoTrainText: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 4,
        paddingHorizontal: 10,
        margin: 15,
        borderRadius: 15,
        overflow: 'hidden'
    },
});

export default styles;
