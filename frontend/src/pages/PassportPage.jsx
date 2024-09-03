import React, { useEffect, useState } from 'react'
import dealService from '../services/dealService'
import { Table, Button, notification, Typography } from 'antd';

const {Text} = Typography


const columns = [
    {
        title: 'Тип', // Type
        dataIndex: 'type',
        key: 'type',
        render: (text) => text || '',
    },
    {
      title: 'Номер сделки', // Deal Number
      dataIndex: 'dealNumber',
      key: 'dealNumber',
      render: (text) => text || '',
    },
    {
      title: 'Дата', // Date
      dataIndex: 'date',
      key: 'date',
      render: (text) => (text ? <Text>{new Date(text).toLocaleDateString()}</Text> : ''),
    },
    {
      title: 'Фабрика', // Factory
      dataIndex: 'factory',
      key: 'factory',
      render: (text) => text || '',
    },
    {
      title: 'Тип топлива', // Fuel Type
      dataIndex: 'fuelType',
      key: 'fuelType',
      render: (text) => text || '',
    },
    {
      title: 'Содержание серы', // Sulfur Content
      dataIndex: 'sulfur',
      key: 'sulfur',
      render: (text) => text || '',
    },
    {
      title: 'Поставщик', // Supplier Name
      dataIndex: ['Supplier', 'name'],
      key: 'supplierName',
      render: (text) => text || '',
    },
    {
      title: 'Номер контракта поставщика', // Supplier Contract Number
      dataIndex: ['Supplier', 'contractNumber'],
      key: 'supplierContractNumber',
      render: (text) => text || '',
    },
    {
      title: 'Объем поставщика', // Supplier Volume
      dataIndex: ['Supplier', 'volume'],
      key: 'supplierVolume',
      render: (text) => text || '',
    },
    {
      title: 'Сумма поставщика', // Supplier Amount
      dataIndex: ['Supplier', 'amount'],
      key: 'supplierAmount',
      render: (text) => text || '',
    },
    {
      title: 'Условия поставки', // Delivery Basis
      dataIndex: ['Supplier', 'deliveryBasis'],
      key: 'deliveryBasis',
      render: (text) => text || '',
    },
    {
      title: 'Условия фиксации', // Fixation Condition
      dataIndex: ['Supplier', 'fixationCondition'],
      key: 'fixationCondition',
      render: (text) => text || '',
    },
    {
      title: 'Тоннаж', // Fill Ton
      dataIndex: ['Supplier', 'fillTon'],
      key: 'fillTon',
      render: (text) => text || '',
    },
    {
      title: 'Дата загрузки', // Fill Date
      dataIndex: ['Supplier', 'fillDate'],
      key: 'fillDate',
      render: (text) => (text ? <Text>{new Date(text).toLocaleDateString()}</Text> : ''),
    },
    {
      title: 'Покупатель', // Buyer Name
      dataIndex: ['Buyer', 'name'],
      key: 'buyerName',
      render: (text) => text || '',
    },
    {
      title: 'Номер контракта покупателя', // Buyer Contract Number
      dataIndex: ['Buyer', 'contractNumber'],
      key: 'buyerContractNumber',
      render: (text) => text || '',
    },
    {
      title: 'Объем покупателя', // Buyer Volume
      dataIndex: ['Buyer', 'volume'],
      key: 'buyerVolume',
      render: (text) => text || '',
    },
    {
      title: 'Сумма покупателя', // Buyer Amount
      dataIndex: ['Buyer', 'amount'],
      key: 'buyerAmount',
      render: (text) => text || '',
    },
    {
      title: 'Условия поставки', // Delivery Basis (Buyer)
      dataIndex: ['Buyer', 'deliveryBasis'],
      key: 'buyerDeliveryBasis',
      render: (text) => text || '',
    },
    {
      title: 'Условия фиксации', // Fixation Condition (Buyer)
      dataIndex: ['Buyer', 'fixationCondition'],
      key: 'buyerFixationCondition',
      render: (text) => text || '',
    },
    {
      title: 'Заявленный объем', // Declared Volume
      dataIndex: ['Buyer', 'declared'],
      key: 'declaredVolume',
      render: (text) => text || '',
    },
    {
      title: 'Объем разгрузки', // Discharge Volume
      dataIndex: ['Buyer', 'dischargeVolume'],
      key: 'dischargeVolume',
      render: (text) => text || '',
    },
    {
      title: 'Дата разгрузки', // Discharge Date
      dataIndex: ['Buyer', 'dischargeDate'],
      key: 'dischargeDate',
      render: (text) => (text ? <Text>{new Date(text).toLocaleDateString()}</Text> : ''),
    },
    {
      title: 'Экспедитор', // Forwarder Name
      dataIndex: ['Forwarder', 'name'],
      key: 'forwarderName',
      render: (text) => text || '',
    },
    {
      title: 'Группа компаний', // Group Company
      dataIndex: ['Forwarder', 'groupCompany'],
      key: 'groupCompany',
      render: (text) => text || '',
    },
    {
      title: 'Планируемый ж/д тариф', // Planned Railway Tariff
      dataIndex: ['Forwarder', 'plannedRailwayTariff'],
      key: 'plannedRailwayTariff',
      render: (text) => text || '',
    },
    {
      title: 'Сумма груза MT', // Cargo Amount MT
      dataIndex: ['Forwarder', 'cargoAmountMT'],
      key: 'cargoAmountMT',
      render: (text) => text || '',
    },
    {
      title: 'Начисленная сумма', // Accrued Amount
      dataIndex: ['Forwarder', 'accruedAmount'],
      key: 'accruedAmount',
      render: (text) => text || '',
    },
    {
      title: 'Фактический ж/д тариф', // Actual Railway Tariff
      dataIndex: ['Forwarder', 'actualRailwayTariff'],
      key: 'actualRailwayTariff',
      render: (text) => text || '',
    },
    {
      title: 'Фактический объем отгрузки MT', // Actual Shipped Volume MT
      dataIndex: ['Forwarder', 'actualShippedVolumeMT'],
      key: 'actualShippedVolumeMT',
      render: (text) => text || '',
    },
    {
      title: 'Фактический объем счета MT', // Actual Volume Invoice MT
      dataIndex: ['Forwarder', 'actualVolumeInvoiceMT'],
      key: 'actualVolumeInvoiceMT',
      render: (text) => text || '',
    },
    {
      title: 'Счет за фактический объем', // Invoice Amount Actual Volume
      dataIndex: ['Forwarder', 'invoiceAmountActualVolume'],
      key: 'invoiceAmountActualVolume',
      render: (text) => text || '',
    },
    {
      title: 'Гарантия', // Security
      dataIndex: ['Forwarder', 'security'],
      key: 'security',
      render: (text) => text || '',
    },
    {
      title: 'Превышение (высокое)', // Excess High
      dataIndex: ['Forwarder', 'excessHigh'],
      key: 'excessHigh',
      render: (text) => text || '',
    },
    {
      title: 'Превышение (переведенное)', // Excess Transferred
      dataIndex: ['Forwarder', 'excessTransferred'],
      key: 'excessTransferred',
      render: (text) => text || '',
    },
    {
      title: 'Штрафы (высокое)', // Penalties High
      dataIndex: ['Forwarder', 'penaltiesHigh'],
      key: 'penaltiesHigh',
      render: (text) => text || '',
    },
    {
      title: 'Штрафы (переведенные)', // Penalties Transferred
      dataIndex: ['Forwarder', 'penaltiesTransferred'],
      key: 'penaltiesTransferred',
      render: (text) => text || '',
    },
    {
        title: 'Дополнительные расходы', // Additional Costs
        dataIndex: ['Forwarder', 'additionalCosts'],
        key: 'additionalCosts',
        render: (text) => text || '',
    },
    {
        title: 'Заполненный объем', // Volume Filled
        dataIndex: ['Forwarder', 'volumeFilled'],
        key: 'volumeFilled',
        render: (text) => text || '',
    },
    {
        title: 'Дата загрузки', // Fill Date
        dataIndex: ['Forwarder', 'fillDate'],
        key: 'forwarderFillDate',
        render: (text) => (text ? <Text>{new Date(text).toLocaleDateString()}</Text> : ''),
    },
    {
        title: 'Цены поставщика', // Supplier Prices
        key: 'supplierPrices',
        render: (record) => (
          <>
            {record.Supplier && record.Supplier.Prices && record.Supplier.Prices.length > 0 ? (
              record.Supplier.Prices.map((price, index) => (
                <div key={index}>
                  {price.currency}: {price.price} ({price.discount})
                </div>
              ))
            ) : (
              ''
            )}
          </>
        ),
      },
      {
        title: 'Группа компании', // Buyer Prices
        key: 'companyGroups',
        dataIndex: ['CompanyGroup', 'names'],
        render: (text) => text || '',
      }
]

const PassportPage = () => {

    const [deals, setDeals] = useState([])

    useEffect(() => {
        fetchDeals()
    }, [])

    const fetchDeals = async () => {
        try {
          const { data } = await dealService.getDeals();
          console.log("DATA: ", data)
          setDeals(data);
        } catch (error) {
          localStorage.removeItem('token');
          notification.error({ message: 'Не удалось получить сделки!' });
        }
    };


    return (
        <Table
            columns={columns}
            dataSource={deals}
            rowKey="dealNumber"
            bordered
        />
    )
}

export default PassportPage