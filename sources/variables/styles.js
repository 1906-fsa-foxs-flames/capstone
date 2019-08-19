/* eslint-disable linebreak-style */
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#575fcf',
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
    }
});

export default styles;
