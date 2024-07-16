import React, { useEffect, useState } from 'react'
import {Table} from 'antd'

const columns = [
	{
	  title: 'ID',
	  dataIndex: 'id',
	  key: 'id',
	},
	{
	  title: 'Name',
	  dataIndex: 'name',
	  key: 'name',
	},
	{
	  title: 'Amount',
	  dataIndex: 'amount',
	  key: 'amount',
	  sorter: (a, b) => a.amount - b.amount,
	  // No filter for amount in this example, but you can add one if needed
	},
	{
	  title: 'Currency',
	  dataIndex: 'currency',
	  key: 'currency',
	  filters: [
		{ text: 'USD', value: 'USD' },
		{ text: 'KZT', value: 'KZT' },
	  ],
	  onFilter: (value, record) => record.currency === value,
	},
	{
	  title: 'Type',
	  dataIndex: 'type',
	  key: 'type',
	  filters: [
		{ text: 'Delivery', value: 'Delivery' },
		{ text: 'Arrival', value: 'Arrival' },
	  ],
	  onFilter: (value, record) => record.type === value,
	},
];

const Deals = () => {
	const [data, setData] = useState([
		// {id: 1, name: "name", type: "Delivery", amount: 100, currency: 'USD'}
	]);
	
	useEffect(() => {
		fetchDeals()
	}, [])

	const fetchDeals = async () => {
		try {
			const response = await fetch("http://localhost:5500/api/deals", {
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("token"),
					"Content-type": "application/json"
				},
				method: 'GET'
			})
			const json = await response.json()
			
			if (response.ok) {
				setData(json.deals)
			} else {
				localStorage.removeItem("token")
				window.location.reload()
			}
		} catch(e) {
			alert("Произошла ошибка")
			console.error(e)
		}
	}
	
	return <Table columns={columns} dataSource={data} rowKey="id" />;
}

export default Deals