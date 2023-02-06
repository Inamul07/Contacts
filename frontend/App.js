import React, { useEffect, useState } from "react";
import {
	View,
	TextInput,
	ScrollView,
	Text,
	StyleSheet,
	TouchableOpacity,
	Alert,
	RefreshControl,
} from "react-native";

const App = () => {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [contacts, setContacts] = useState([]);

	const domain = "http://192.168.29.45:8000/";

	useEffect(() => {
		loadData();
	}, []);

	const loadData = () => {
		let contactsFromDB = [];
		fetch(domain + "contacts")
			.then((res) => res.json())
			.then((result) => {
				contactsFromDB = result.data;
				let newContacts = [];
				for (var i = 0; i < contactsFromDB.length; i++) {
					var name = contactsFromDB[i]["name"],
						phone = contactsFromDB[i]["phone"];
					newContacts.push({ name, phone });
				}
				setContacts(newContacts);
			});
	};

	const addContact = () => {
		if (name === "" || phone === "") {
			Alert.alert("Error", "Cannot add empty values");
			return false;
		}
		if (phone.length != 10) {
			Alert.alert("Error", "Phone number has 10 digits 🤓");
			return false;
		}
		setContacts([...contacts, { name, phone }]);
		setName("");
		setPhone("");
		fetch(domain + "create-contact", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: name, phone: phone }),
		});
	};

	const deleteContact = (index) => {
		Alert.alert("Delete Conatct", "Do you want to delete this contact?", [
			{
				text: "No",
				onPress: () => {
					return false;
				},
			},
			{
				text: "Yes",
				onPress: () => {
					const phone = contacts[index]["phone"];
					let contactsCopy = [...contacts];
					contactsCopy.splice(index, 1);
					setContacts(contactsCopy);
					fetch(domain + "delete-contact?phone=" + phone, {
						method: "DELETE",
						mode: "cors",
					});
					return true;
				},
			},
		]);
	};

	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		loadData();
		setTimeout(() => {
			setRefreshing(false);
		}, 1000);
	}, []);

	return (
		<View style={styles.container}>
			<TextInput
				style={[styles.input, { marginTop: 50 }]}
				placeholder="Name"
				value={name}
				onChangeText={(text) => setName(text)}
				placeholderTextColor="#202225"
			/>
			<TextInput
				style={styles.input}
				placeholder="Phone Number"
				value={phone}
				onChangeText={(text) => setPhone(text)}
				placeholderTextColor="#202225"
				keyboardType="number-pad"
			/>
			<TouchableOpacity style={styles.button} onPress={addContact}>
				<Text style={styles.buttonText}>Add Contact</Text>
			</TouchableOpacity>
			<ScrollView
				style={styles.scrollView}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			>
				{contacts.map((contact, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => deleteContact(index)}
					>
						<View style={styles.card}>
							<Text style={styles.cardText}>
								Name: {contact.name}
							</Text>
							<Text style={styles.cardText}>
								Phone: {contact.phone}
							</Text>
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#2f3136",
		alignItems: "center",
		justifyContent: "center",
	},
	input: {
		width: "100%",
		padding: 10,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: "#fff",
		marginTop: 20,
		borderRadius: 30,
		color: "#202225",
		backgroundColor: "#f8f8f8",
	},
	button: {
		backgroundColor: "dodgerblue",
		padding: 10,
		borderRadius: 5,
		marginTop: 20,
	},
	buttonText: {
		color: "#202225",
		fontWeight: "bold",
		textAlign: "center",
	},
	scrollView: {
		marginTop: 20,
		width: "100%",
		borderColor: "#fff",
	},
	card: {
		padding: 20,
		marginBottom: 10,
		borderWidth: 1,
		borderRadius: 15,
		margin: 10,
		backgroundColor: "#536878",
	},
	cardText: {
		fontSize: 18,
		color: "#D2D2D2",
		margin: 3,
	},
});

export default App;
