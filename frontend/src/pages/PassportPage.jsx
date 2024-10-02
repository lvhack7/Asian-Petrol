import React, { useEffect, useState } from 'react'
import dealService from '../services/dealService'
import { Table, Button, notification, Typography } from 'antd';

const {Text} = Typography


const fuelColorMapping = {
  "ВГО": "#a2b5dc",
  "ВГО 2%": "#dbe0ef",
  "Мазут": "#b5d8a4",
  "ДТ": "#ddd5c3",
  "Нефть": "#d3956e",
  "АИ-92 К4": "#f0b04c",
  "АИ-92 К5": "#f8e08d",
  "Нефрас": "#5473a6",
  "Газ": "#9e9a94",
  "Печное топливо": "#858793",
  "Авиакеросин": "#a69784",
  "ДТЗ-К4/К5": "#d2cdc0",
  "АИ-92 К4/К5": "#f1c653",
  "Аи-95-К4": "#f9e4a3",
  "Аи-95": "#f9e4a3",
  "АИ-80": "#b5d8a4",
  "Кокс": "#af853c",
  "Параксилол": "#6fc5e7",
  "Судовое топливо": "#bde4df",
  "Нафта": "#aaa8a4",
  "ДТ-А-К5": "#f9e465",
  "АИ-98": "#a6e5b4"
};

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
      title: 'Вид ГСМ', // Factory
      dataIndex: 'fuelType',
      key: 'fuelType',
      render: (text) => (
        <div style={{ backgroundColor: fuelColorMapping[text], padding: '10px', borderRadius: '4px' }}>
            {text}
        </div>
      ),
    },
    {
      title: 'Содержание серы, %', // Sulfur Content
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
      title: 'Сумма по приложению', // Supplier Amount
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
      title: 'Цены поставщика', // Supplier Prices
      key: 'supplierPrices',
      render: (record) => (
        <>
          {record.Supplier && record.Supplier.Prices && record.Supplier.Prices.length > 0 ? (
            record.Supplier.Prices.map((price, index) => (
              <div key={index}>
                {index+1}: {price.price} {price.currency}
              </div>
            ))
          ) : (
            ''
          )}
        </>
      ),
    },
    {
      title: 'Сумма  отгрузки, (факт)', // Supplier Amount
      key: 'supplierAmount1',
      render: (record) => {
        return Number(record?.Supplier?.Prices[0]?.price) * Number(record?.Supplier?.volume) || ''
      } 
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
      title: 'Законтракт. на сумму', // Buyer Amount
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
      title: 'Цены покупателя', // Supplier Prices
      key: 'buyerPrices',
      render: (record) => (
        <>
          {record.Buyer && record.Buyer.Prices && record.Buyer.Prices.length > 0 ? (
            record.Buyer.Prices.map((price, index) => (
              <div key={index}>
                {index+1}: {price.price} {price.currency}
              </div>
            ))
          ) : (
            ''
          )}
        </>
      ),
    },
    {
      title: 'Отгружено на сумму', // Supplier Amount
      key: 'supplierAmount2',
      render: (record) => {
        return Number(record?.Buyer?.Prices[0]?.price) * Number(record?.Buyer?.volume) || ''
      } 
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
        title: 'Группа компании', // Buyer Prices
        key: 'companyGroups',
        dataIndex: ['CompanyGroup', 'names'],
        render: (text) => text || '',
      },
      {
        title: 'Цены Группа компаний', // Supplier Prices
        key: 'companyPrices',
        render: (record) => (
          <>
            {record.CompanyGroup && record.CompanyGroup.Prices && record.CompanyGroup.Prices.length > 0 ? (
              record.CompanyGroup.Prices.map((price, index) => (
                <div key={index}>
                  {index+1}: {price.price} {price.currency}
                </div>
              ))
            ) : (
              ''
            )}
          </>
        ),
      },
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