import { useEffect, useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { api } from "../config/axios";
import { Picker } from "@react-native-picker/picker";

const showSucccessMessage = (title ,message) => {
    showMessage({
        type: "success",
        icon:'success',
        message: title,
        description: message,
        floating: true
    });
}

const showErrorMessage = (title ,message) => {
    showMessage({
        type: 'danger',
        icon:'danger',
        message: title,
        description: message,
        floating: true
    });
}

export default function SalesScreen(){
    const initForm = {
        sellerId: {
            value: '',
            isValid: true,
            color: '#636161'
        },
        zone: {
            value: '',
            isValid: true,
            color: '#636161'
        },
        date: {
            value: new Date(),
            isValid: true,
            color: '#636161'
        },
        price: {
            value: '',
            isValid: true,
            color: '#636161'
        },
    }

    const [saleForm, setSaleForm] = useState(initForm)
    const [sellers, setSellers] = useState([])
    const [seller, setSeller] = useState(null)
    const [zone, setZone] = useState(null)

    const getIsValidForm = () => {
        const sale = Object.values(saleForm)
        const isValidEntries = sale.every(p => p.isValid) && seller != null && zone != null

        return isValidEntries
    }

    const onPressRegister = async () => {

        const sale = {
            identificationSeller: seller,
            zone: zone,
            date: saleForm.date.value.toLocaleDateString("en-US"),
            price: +saleForm.price.value
        }

        const url = `/sales`
        const { data : saleRegistered  } = await api.post(url, sale)

        if(!saleRegistered.identificationSeller)
            return showErrorMessage('Error registering sale',`Error sale seller with id seller ${seller}`)

        setSaleForm(initForm)
        setSeller(null)
        setZone(null)

        showSucccessMessage('Sale registered', `The sale with id seller ${seller} is now in DB`)
    }

    useEffect(async() => {
        const url = `/sellers`
        const { data : sellers } = await api.get(url)

        setSellers(sellers)
    }, [])
    

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView style={{ width: '100%', marginVertical: '10%' }}>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>

                    <View style={{ width: '85%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>

                        <Text style={{ fontSize: 30, marginBottom: 20 }} >Sale</Text>

                        <View style={{ marginBottom: 30, width: '100%' }}>

                            <Text style={{ marginBottom: 5, color: saleForm.sellerId.color }}>Sale</Text>
                            <Picker
                                selectedValue={seller}
                                onValueChange={item => 
                                    setSeller(item)
                                }
                            >
                                <Picker.Item label='Select' value={null} />

                                {
                                    sellers.map(seller => {
                                        return(
                                            <Picker.Item label={seller.name} value={seller.identification} />
                                        )
                                    })
                                }
                            </Picker>
                        </View>

                        <View style={{ marginBottom: 30, width: '100%' }}>

                            <Text style={{ marginBottom: 5, color: saleForm.zone.color }}>Zone</Text>
                            
                            <Picker
                            selectedValue={zone}
                            onValueChange={item => 
                                setZone(item)
                            }
                            >
                                <Picker.Item label='Select' value={null} />
                                <Picker.Item label='Norte' value='Norte'/>
                                <Picker.Item label='Sur' value='Sur'/>

                            </Picker>

                        </View>

                        <View style={{ marginBottom: 20, width: '100%' }}>

                            <Text style={{ marginBottom: 5, color: '#636161' }}>Date</Text>
                            <Text style={{ borderRadius: 10, backgroundColor: '#E8E8E8', padding: 10 }}> { saleForm.date.value.toLocaleDateString("en-US") } </Text>

                        </View>

                        <View style={{ marginBottom: 25, width: '100%' }}>

                            <Text style={{ marginBottom: 5, color: saleForm.price.color }}>Price</Text>
                            <TextInput style={{ borderRadius: 10, borderColor: saleForm.price.color, borderWidth: .3, padding: 10 }} maxLength={30} value={ saleForm.price.value } placeholder='Identification' onChangeText={(v) => {

                                const isValid = +v >= 2000000

                                setSaleForm(s => ({
                                    ...s,
                                    price: {
                                        value: +v,
                                        isValid,
                                        color: isValid ? "green" : "red"
                                    }
                                }))

                            }} ></TextInput>
                        </View>

                        <View style={{ width: '100%', backgroundColor: '#DEDCDB', padding: 10, borderRadius: 5 }}>

                            <Button
                                onPress={ onPressRegister }
                                title="Register"
                                color='#636161'
                                disabled={ !getIsValidForm() }
                            />

                        </View>
                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
