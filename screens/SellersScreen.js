import { useState } from "react";
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { api } from "../config/axios";

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

export default function SellersScreen(){
    const initForm = {
        identification: {
            value: '',
            isValid: false,
            color: '#636161'
        },
        name: {
            value: '',
            isValid: false,
            color: '#636161'
        },
        email: {
            value: '',
            isValid: false,
            color: '#636161'
        },
        commission: {
            value: 0,
            isValid: true,
            color: '#636161'
        },
    }

    const [sellerForm, setSellerForm] = useState(initForm)

    const getIsValidForm = () => {
        const seller = Object.values(sellerForm)
        const isValidEntries = seller.every(p => p.isValid)

        return isValidEntries
    }

    const onPressRegister = async () => {

        const urlSearchSeller = `/sellers/${sellerForm.identification.value}`
        const { data : sellerFound } = await api.get(urlSearchSeller)

        if(sellerFound.identification)
            return showErrorMessage('Seller already registered',`The seller with id ${sellerForm.identification.value} is already in DB`)

        const seller = {
            identification: +sellerForm.identification.value,
            name: sellerForm.name.value,
            email: sellerForm.email.value,
        }

        const url = `/sellers`
        const { data : sellerRegistered  } = await api.post(url, seller)

        if(!sellerRegistered.identification)
            return showErrorMessage('Error registering seller',`Error registering seller with id ${sellerForm.identification.value}`)

        setSellerForm(initForm)

        showSucccessMessage('Seller registered', `The seller with id ${sellerForm.identification.value} is now in DB`)
    }

    const onPressSearch = async () => {
        const url = `/sellers/${sellerForm.identification.value}`
        const { data : seller } = await api.get(url)

        if(!seller.identification)
            showErrorMessage('No seller found',`No seller found with id ${sellerForm.identification.value}`)
        
        setSellerForm({
            identification: {
            value: seller.identification,
            isValid: true,
            color: 'green'
        },
        name: {
            value: seller.name,
            isValid: true,
            color: 'green'
        },
        email: {
            value: seller.email,
            isValid: true,
            color: 'green'
        },
        commission: {
            value: seller.commission,
            isValid: true,
            color: '#636161'
        },
        })

        showSucccessMessage('Seller found', `Seller found with id ${seller.identification}`)
    }

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView style={{ width: '100%', marginVertical: '10%' }}>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>

                    <View style={{ width: '85%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>

                        <Text style={{ fontSize: 30, marginBottom: 20 }} >Seller</Text>

                        <View style={{ marginBottom: 25, width: '100%' }}>

                            <Text style={{ marginBottom: 5, color: sellerForm.identification.color }}>Identification</Text>
                            <TextInput style={{ borderRadius: 10, borderColor: sellerForm.identification.color, borderWidth: .3, padding: 10 }} maxLength={30} value={ sellerForm.identification.value } placeholder='Identification' onChangeText={(v) => {

                                const reg = /^[0-9]{10}$/
                                const isValid = reg.test(v)

                                setSellerForm(s => ({
                                    ...s,
                                    identification: {
                                        value: +v,
                                        isValid,
                                        color: isValid ? "green" : "red"
                                    }
                                }))

                            }} ></TextInput>
                        </View>
                        <View style={{ marginBottom: 25, width: '100%' }}>

                            <Text style={{ marginBottom: 5, color: sellerForm.name.color }}>Name</Text>
                            <TextInput style={{ borderRadius: 10, borderColor: sellerForm.name.color, borderWidth: .3, padding: 10 }} maxLength={30} value={ sellerForm.name.value } placeholder='Name' onChangeText={(v) => {

                                const reg = /^[A-zÁ-ü ]{5,30}$/
                                const isValid = reg.test(v)

                                setSellerForm(s => ({
                                    ...s,
                                    name: {
                                        value: v,
                                        isValid,
                                        color: isValid ? "green" : "red"
                                    }
                                }))

                            }} ></TextInput>
                        </View>
                        <View style={{ marginBottom: 25, width: '100%' }}>

                            <Text style={{ marginBottom: 5, color: sellerForm.email.color }}>Email</Text>
                            <TextInput style={{ borderRadius: 10, borderColor: sellerForm.email.color, borderWidth: .3, padding: 10 }} maxLength={30} value={ sellerForm.email.value } placeholder='Email' onChangeText={(v) => {
                                const reg = /^\S+@\S+\.\S+$/
                                const isValid = reg.test(v)

                                setSellerForm(s => ({
                                    ...s,
                                    email: {
                                        value: v,
                                        isValid,
                                        color: isValid ? "green" : "red"
                                    }
                                }))

                            }} ></TextInput>
                        </View>

                         <View style={{ marginBottom: 20, width: '100%' }}>

                            <Text style={{ marginBottom: 5, color: '#636161' }}>Commission</Text>
                            <Text style={{ borderRadius: 10, backgroundColor: '#E8E8E8', padding: 10 }}> { sellerForm.commission.value } </Text>

                        </View>

                        <View style={{ width: '100%', backgroundColor: '#DEDCDB', padding: 10, borderRadius: 5 }}>

                            <Button
                                onPress={ onPressRegister }
                                title="Register"
                                color='#636161'
                                disabled={ !getIsValidForm() }
                            />

                        </View>

                        <View style={{ width: '100%', backgroundColor: '#DEDCDB', padding: 10, borderRadius: 5, marginTop: 10 }}>

                            <Button
                                onPress={ onPressSearch }
                                title="Search"
                                color='#636161'
                                disabled={ !sellerForm.identification.isValid }
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
