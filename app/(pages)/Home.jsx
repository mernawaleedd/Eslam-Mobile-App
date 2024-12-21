import React, { useEffect } from "react";
import { Text } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { use } from "react";
import { useState } from "react";
const Home = () => {
	const { getFunction } = useGlobalContext();
	const [counter, setcounter] = useState(0);
	const getItemAsync = async (key) => {
		try {
			const req = await getFunction(`failure`);
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		setTimeout(() => {
			getItemAsync(`failure`);
		}, 7000);
	}, [counter]);
	return (
		<>
			<Text>test</Text>
		</>
	);
};

export default Home;
