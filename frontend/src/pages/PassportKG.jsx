import React, { useEffect, useState } from 'react'
import dealService from '../services/dealService'
import { Table, notification, Typography, Empty, Spin, message } from 'antd';
import refService from '../services/refService';


const {Text} = Typography

function formatNumber(number) {
  if (!number) return '';

  // Check if the input is a string and can be parsed into a valid number
  const num = typeof number === 'string' ? parseFloat(number.replace(',', '.').replace(/\s/g, '')) : number;

  // If not a valid number, return an empty string
  if (isNaN(num)) return number;

  return num.toLocaleString('ru-RU', {
    minimumFractionDigits: 0
  }).replace(/\s/g, ' ').replace(',', '.'); // Ensures space separator for thousands
}


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
    render: (text) => (text ? <Text>{new Date(text).toLocaleDateString("ru-RU", {
      month: "2-digit",
      year: "numeric"
    }).replace(/\./g, "/")}</Text> : ''),
  },
  {
    title: 'Завод', // Factory
    dataIndex: 'factory',
    key: 'factory',
    render: (text) => text || '',
  },
  {
    title: 'Вид ГСМ', // Factory
    dataIndex: 'fuelType',
    key: 'fuelType',
    render: (text) => text || ''
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
    title: '№ договор / приложение', // Supplier Contract Number
    dataIndex: ['Supplier', 'contractNumber'],
    key: 'supplierContractNumber',
    render: (text) => text || '',
  },
  {
    title: 'Законтрактовано по приложению', // Supplier Volume
    dataIndex: ['Supplier', 'volume'],
    key: 'supplierVolume',
    render: (text) => text || '',
  },
  {
    title: 'Сумма по приложению',
    dataIndex: ['Supplier', 'amount'], // Supplier Amount
    key: 'supplierAmount',
    render: (text) => text || '',
  },
  {
    title: 'Базис поставки', // Delivery Basis
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
    title: 'Цены покупки', // Parent column for Supplier Prices
    children: [
      {
        title: 'Валюта', // Column for Currency
        key: 'currency',
        render: (record) => (
            <>
                {record.Supplier?.Prices.map((price, index) => (
                    <div
                        key={`currency-${index}`}
                        style={{
                            width: '100%',
                            borderBottom: '1px solid #e0e0e0',
                            marginBottom: '4px',
                            padding: '0',
                        }}
                    >
                        {price.currency ?? 'Пусто'}
                    </div>
                ))}
            </>
        ),
      },
      {
        title: 'Коммент', // Column for Quotation
        key: 'commentary',
        render: (record) => (
            <>
                {record.Supplier?.Prices.map((price, index) => (
                    <div
                        key={`commentary-${index}`}
                        style={{
                            width: '100%',
                            borderBottom: '1px solid #e0e0e0',
                            marginBottom: '4px',
                            padding: '0',
                        }}
                    >
                        {price.commentary ?? 'Пусто'}
                    </div>
                ))}
            </>
        ),
      },
      {
          title: 'Котировка', // Column for Quotation
          key: 'quotation',
          render: (record) => (
              <>
                  {record.Supplier?.Prices.map((price, index) => (
                      <div
                          key={`quotation-${index}`}
                          style={{
                              width: '100%',
                              borderBottom: '1px solid #e0e0e0',
                              marginBottom: '4px',
                              padding: '0',
                          }}
                      >
                          {price.quotation ?? 'Пусто'}
                      </div>
                  ))}
              </>
          ),
      },
      {
        title: 'Скидка', // Column for Discount
        key: 'discount',
        render: (record) => (
            <>
                {record.Supplier?.Prices.map((price, index) => (
                    <div
                        key={`discount-${index}`}
                        style={{
                            width: '100%',
                            borderBottom: '1px solid #e0e0e0',
                            marginBottom: '4px',
                            padding: '0',
                        }}
                    >
                        {price.discount ?? 'Пусто'}
                    </div>
                ))}
            </>
        ),
      },
      {
          title: 'Цена', // Column for Price
          key: 'price',
          render: (record) => (
              <>
                  {record.Supplier?.Prices.map((price, index) => (
                      <div
                          key={`price-${index}`}
                          style={{
                              width: '100%',
                              borderBottom: '1px solid #e0e0e0',
                              marginBottom: '4px',
                              padding: '0',
                          }}
                      >
                          {price.price ? price.price : Number(price.quotation) - Number(price.discount)}
                      </div>
                  ))}
              </>
          ),
      },
    ],
  },
  {
    title: 'Налив поставщик', // Parent column for Supplier Shipment
    children: [
      {
        title: 'Тонн', // Column for Tonn
        key: 'suppTonn',
        render: (record) => (
          <>
            {record.Supplier && record.Supplier.Tonns && record.Supplier.Tonns.length > 0 ? (
              record.Supplier.Tonns.map((tonn, index) => (
                <div
                  key={index}
                  style={{
                    width: '100%', // Ensures the div spans the full width
                    borderBottom: '1px solid #e0e0e0', // Full-width separator
                    marginBottom: '4px',
                    padding: '0', // Remove any padding within the div
                  }}
                >
                  {tonn.tonn}
                </div>
              ))
            ) : (
              ''
            )}
          </>
        ),
      },
      {
        title: 'Дата отгрузки', // Column for Date
        key: 'suppDate',
        render: (record) => (
          <>
            {record.Supplier && record.Supplier.Tonns && record.Supplier.Tonns.length > 0 ? (
              record.Supplier.Tonns.map((tonn, index) => (
                <div
                  key={index}
                  style={{
                    width: '100%', // Ensures the div spans the full width
                    borderBottom: '1px solid #e0e0e0', // Full-width separator
                    marginBottom: '4px',
                    padding: '0', // Remove any padding within the div
                  }}
                >
                  {tonn.date ? new Date(tonn.date).toLocaleDateString() : ''}
                </div>
              ))
            ) : (
              ''
            )}
          </>
        ),
      },
    ],
  },
  {
    title: 'Сумма налива', // Supplier Amount
    key: 'supplierAmount1',
    render: (record) => {
        return (
            <div style={{ padding: '0' }}>
                {record.Supplier?.Prices?.map((price, index) => {
                    const tonn = record.Supplier?.Tonns[index]?.tonn;
                    const amount = tonn ? Number(price.price) * Number(tonn.replace(',', '.')) : 0;

                    return (
                        <div
                            key={`supplierAmount-${index}`}
                            style={{
                                borderBottom: index !== record.Supplier.Prices.length - 1 ? '1px solid #e0e0e0' : 'none', // Add separator between items
                                marginBottom: '4px',
                                padding: '0',
                            }}
                        >
                            {amount.toFixed(2)} {/* Display individual amount with 2 decimal places */}
                        </div>
                    );
                })}
            </div>
        );
    }
  },
  {
    title: 'Оплата поставщик', // Parent column for Supplier Shipment
    children: [
      {
        title: 'Сумма', // Column for Tonn
        key: 'paymentSupp',
        render: (record) => (
          <>
            {record.Supplier && record.Supplier.Payments && record.Supplier.Payments.length > 0 ? (
              record.Supplier.Payments.map((tonn, index) => (
                <div
                  key={index}
                  style={{
                    width: '100%', // Ensures the div spans the full width
                    borderBottom: '1px solid #e0e0e0', // Full-width separator
                    marginBottom: '4px',
                    padding: '0', // Remove any padding within the div
                  }}
                >
                  {tonn.payment}
                </div>
              ))
            ) : (
              ''
            )}
          </>
        ),
      },
      {
        title: 'Дата оплаты', // Column for Date
        key: 'suppDate',
        render: (record) => (
          <>
            {record.Supplier && record.Supplier.Payments && record.Supplier.Payments.length > 0 ? (
              record.Supplier.Payments.map((tonn, index) => (
                <div
                  key={index}
                  style={{
                    width: '100%', // Ensures the div spans the full width
                    borderBottom: '1px solid #e0e0e0', // Full-width separator
                    marginBottom: '4px',
                    padding: '0', // Remove any padding within the div
                  }}
                >
                  {tonn.date ? new Date(tonn.date).toLocaleDateString() : ''}
                </div>
              ))
            ) : (
              ''
            )}
          </>
        ),
      },
    ],
  },
  {
    title: 'ДТ/КТ', // Final Amount
    key: 'finalAmount',
    render: (record) => {
        // Calculate total supplier amount
        const totalSupplierAmount = record.Supplier?.Prices?.reduce((total, price, index) => {
          const tonn = record.Supplier.Tonns?.[index]?.tonn || 0; // Handle undefined Tonn
          const priceValue = price.price || (Number(price.quotation) - Number(price.discount)) || 0;
          const amount = tonn ? Number(tonn.replace(',', '.')) * priceValue : 0;
          return total + amount;
        }, 0) || 0;

        // Calculate total payments (Платежи), defaulting to 0 if Payments is null or empty
        const totalPayments = (record.Supplier?.Payments?.length > 0)
            ? record.Supplier?.Payments?.reduce((total, payment) => total + (payment.payment || 0), 0)
            : 0;

        // Calculate final amount
        const finalAmount = totalSupplierAmount - totalPayments;

        return (
            <div style={{ padding: '0' }}>
                {finalAmount.toFixed(2)} {/* Display final amount with 2 decimal places */}
            </div>
        );
    }
  },
  {
    title: 'Группа компании 1', // First name column
    key: 'companyGroupName1',
    dataIndex: ['CompanyGroup', 'names'],
    render: (text) => {
      const names = text ? text.split(',') : [];
      return names[0] || ''; // Render the first name
    },
  },
  {
    title: 'Цена', // Parent column for Supplier Prices
    children: [
      {
        title: 'Валюта', // Column for Currency
        key: 'currency',
        render: (record) => (
            <>
                {record.CompanyGroup?.Prices.map((price, index) => (
                    <div
                        key={`currency-${index}`}
                        style={{
                            width: '100%',
                            borderBottom: '1px solid #e0e0e0',
                            marginBottom: '4px',
                            padding: '0',
                        }}
                    >
                        {price.currency ?? 'Пусто'}
                    </div>
                ))}
            </>
        ),
      },
      {
        title: 'Коммент', // Column for Quotation
        key: 'commentary',
        render: (record) => (
            <>
                {record.CompanyGroup?.Prices.map((price, index) => (
                    <div
                        key={`commentary-${index}`}
                        style={{
                            width: '100%',
                            borderBottom: '1px solid #e0e0e0',
                            marginBottom: '4px',
                            padding: '0',
                        }}
                    >
                        {price.commentary ?? 'Пусто'}
                    </div>
                ))}
            </>
        ),
      },
      {
        title: '# Приложения/договор', // Column for Discount
        key: 'discount',
        render: (record) => (
            <>
                {record.CompanyGroup?.Prices.map((price, index) => (
                    <div
                        key={`discount-${index}`}
                        style={{
                            width: '100%',
                            borderBottom: '1px solid #e0e0e0',
                            marginBottom: '4px',
                            padding: '0',
                        }}
                    >
                        {price.discount ?? 'Пусто'}
                    </div>
                ))}
            </>
        ),
      },
      {
          title: 'Цена', // Column for Price
          key: 'price',
          render: (record) => (
              <>
                  {record.CompanyGroup?.Prices.map((price, index) => (
                      <div
                          key={`price-${index}`}
                          style={{
                              width: '100%',
                              borderBottom: '1px solid #e0e0e0',
                              marginBottom: '4px',
                              padding: '0',
                          }}
                      >
                          {price.price ?? 'Пусто'}
                      </div>
                  ))}
              </>
          ),
      },
    ],
  },
  {
    title: 'Группа компании 2', // Second name column
    key: 'companyGroupName2',
    dataIndex: ['CompanyGroup', 'names'],
    render: (text) => {
      const names = text ? text.split(',') : [];
      return names[1] || ''; // Render the second name (if it exists)
    },
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
    render: (text) => formatNumber(text),
  },
  {
    title: 'Законтракт. на сумму', // Buyer Amount
    key: 'buyerAmount',
    render: (record) => {
      return formatNumber(Number(record?.Buyer?.Prices[0]?.price) * Number(record?.Buyer?.volume))
    } 
  },
  {
    title: 'Базис поставки', // Delivery Basis
    dataIndex: ['Buyer', 'deliveryBasis'],
    key: 'deliveryBasis',
    render: (text) => text || '',
  },
  {
    title: 'Станция назначения', // Delivery Basis
    dataIndex: ['Buyer', 'destinationStation'],
    key: 'destinationStation',
    render: (text) => text || '',
  },
  {
    title: 'Условия фиксации', // Fixation Condition (Buyer)
    dataIndex: ['Buyer', 'fixationCondition'],
    key: 'buyerFixationCondition',
    render: (text) => text || '',
  },
  {
    title: 'Цена продажи', // Parent column for Supplier Prices
    children: [
      {
        title: 'Валюта', // Column for Currency
        key: 'currency',
        render: (record) => (
            <>
                {record.Buyer?.Prices.map((price, index) => (
                    <div
                        key={`currency-${index}`}
                        style={{
                            width: '100%',
                            borderBottom: '1px solid #e0e0e0',
                            marginBottom: '4px',
                            padding: '0',
                        }}
                    >
                        {price.currency ?? 'Пусто'}
                    </div>
                ))}
            </>
        ),
      },
      {
        title: 'Коммент', // Column for Quotation
        key: 'commentary',
        render: (record) => (
            <>
                {record.Buyer?.Prices.map((price, index) => (
                    <div
                        key={`commentary-${index}`}
                        style={{
                            width: '100%',
                            borderBottom: '1px solid #e0e0e0',
                            marginBottom: '4px',
                            padding: '0',
                        }}
                    >
                        {price.commentary ?? 'Пусто'}
                    </div>
                ))}
            </>
        ),
      },
      {
          title: 'Котировка', // Column for Quotation
          key: 'quotation',
          render: (record) => (
              <>
                  {record.Buyer?.Prices.map((price, index) => (
                      <div
                          key={`quotation-${index}`}
                          style={{
                              width: '100%',
                              borderBottom: '1px solid #e0e0e0',
                              marginBottom: '4px',
                              padding: '0',
                          }}
                      >
                          {price.quotation ?? 'Пусто'}
                      </div>
                  ))}
              </>
          ),
      },
      {
        title: 'Скидка', // Column for Discount
        key: 'discount',
        render: (record) => (
            <>
                {record.Buyer?.Prices.map((price, index) => (
                    <div
                        key={`discount-${index}`}
                        style={{
                            width: '100%',
                            borderBottom: '1px solid #e0e0e0',
                            marginBottom: '4px',
                            padding: '0',
                        }}
                    >
                        {price.discount ?? 'Пусто'}
                    </div>
                ))}
            </>
        ),
      },
      {
          title: 'Цена', // Column for Price
          key: 'price',
          render: (record) => (
              <>
                  {record.Buyer?.Prices.map((price, index) => (
                      <div
                          key={`price-${index}`}
                          style={{
                              width: '100%',
                              borderBottom: '1px solid #e0e0e0',
                              marginBottom: '4px',
                              padding: '0',
                          }}
                      >
                          {price.price ? price.price : Number(price.quotation) - Number(price.discount)}
                      </div>
                  ))}
              </>
          ),
      },
    ],
  },
  {
    title: 'Заявленный объем', // Declared Volume
    dataIndex: ['Buyer', 'declared'],
    key: 'declaredVolume',
    render: (text) => formatNumber(text),
  },
  // {
  //   title: 'Обьем разгрузки', // Declared Volume
  //   dataIndex: ['Buyer', 'unloadVolume'],
  //   key: 'unloadVolume',
  //   render: (text) => text || '',
  // },
  // {
  //   title: 'Дата разгрузки', // Declared Volume
  //   dataIndex: ['Buyer', 'unloadDate'],
  //   key: 'unloadDate',
  //   render: (text) => (text ? <Text>{new Date(text).toLocaleDateString("ru-RU", {
  //     month: "2-digit",
  //     year: "numeric"
  //   }).replace(/\./g, "/")}</Text> : ''),
  // },
  {
    title: 'Отгрузка покупателя', // Parent column for Buyer Shipment
    children: [
      {
        title: 'Тонн', // Column for Tonn
        key: 'buyTonn',
        render: (record) => (
          <>
            {record.Buyer && record.Buyer.Tonns && record.Buyer.Tonns.length > 0 ? (
              record.Buyer.Tonns.map((tonn, index) => (
                <div key={index}>
                  {tonn.tonn}
                </div>
              ))
            ) : (
              ''
            )}
          </>
        ),
      },
      {
        title: 'Дата', // Column for Date
        key: 'buyDate',
        render: (record) => (
          <>
            {record.Buyer && record.Buyer.Tonns && record.Buyer.Tonns.length > 0 ? (
              record.Buyer.Tonns.map((tonn, index) => (
                <div key={index}>
                  {new Date(tonn.date).toLocaleDateString()}
                </div>
              ))
            ) : (
              ''
            )}
          </>
        ),
      },
    ],
  },  
  {
    title: 'Отгружено на сумму', // Buyer Amount
    key: 'buyerAmount6',
    render: (record) => {
        return (
            <div style={{ padding: '0' }}>
                {record.Buyer?.Prices?.map((price, index) => {
                    const tonn = record.Buyer.Tonns[index]?.tonn;
                    const amount = tonn ? Number(price.price) * Number(tonn.replace(',', '.')) : 0;

                    return (
                        <div
                            key={`buyerAmount-${index}`}
                            style={{
                                borderBottom: index !== record.Buyer.Prices.length - 1 ? '1px solid #e0e0e0' : 'none', // Add separator between items
                                marginBottom: '4px',
                                padding: '0',
                            }}
                        >
                            {amount.toFixed(2)} {/* Display individual amount with 2 decimal places */}
                        </div>
                    );
                })}
            </div>
        );
    }
  },                                           
  {
    title: 'Оплата покупатель', // Parent column for Supplier Shipment
    children: [
      {
        title: 'Сумма', // Column for Tonn
        key: 'paymentSupp',
        render: (record) => (
          <>
            {record.Buyer && record.Buyer.Payments && record.Buyer.Payments.length > 0 ? (
              record.Buyer.Payments.map((tonn, index) => (
                <div
                  key={index}
                  style={{
                    width: '100%', // Ensures the div spans the full width
                    borderBottom: '1px solid #e0e0e0', // Full-width separator
                    marginBottom: '4px',
                    padding: '0', // Remove any padding within the div
                  }}
                >
                  {tonn.payment}
                </div>
              ))
            ) : (
              ''
            )}
          </>
        ),
      },
      {
        title: 'Дата оплаты', // Column for Date
        key: 'suppDate',
        render: (record) => (
          <>
            {record.Buyer && record.Buyer.Payments && record.Buyer.Payments.length > 0 ? (
              record.Buyer.Payments.map((tonn, index) => (
                <div
                  key={index}
                  style={{
                    width: '100%', // Ensures the div spans the full width
                    borderBottom: '1px solid #e0e0e0', // Full-width separator
                    marginBottom: '4px',
                    padding: '0', // Remove any padding within the div
                  }}
                >
                  {tonn.date ? new Date(tonn.date).toLocaleDateString() : ''}
                </div>
              ))
            ) : (
              ''
            )}
          </>
        ),
      },
    ],
  },
  {
    title: 'ДТ/КТ', // Final Amount
    key: 'finalAmount5',
    render: (record) => {
        // Calculate total supplier amount
        const totalSupplierAmount = record.Buyer?.Prices?.reduce((total, price, index) => {
          const tonn = record.Buyer.Tonns?.[index]?.tonn || 0; // Handle undefined Tonn
          const priceValue = price.price || (Number(price.quotation) - Number(price.discount)) || 0;
          const amount = tonn ? Number(tonn.replace(',', '.')) * priceValue : 0;
          return total + amount;
        }, 0) || 0;

        // Calculate total payments (Платежи), defaulting to 0 if Payments is null or empty
        const totalPayments = (record.Buyer?.Payments?.length > 0)
            ? record.Buyer?.Payments?.reduce((total, payment) => total + (payment.payment || 0), 0)
            : 0;

        // Calculate final amount
        const finalAmount = totalSupplierAmount - totalPayments;

        return (
            <div style={{ padding: '0' }}>
                {finalAmount.toFixed(2)} {/* Display final amount with 2 decimal places */}
            </div>
        );
    }
  },
  {
    title: 'Экспедитор', // Forwarder Name
    dataIndex: ['Forwarder', 'name'],
    key: 'forwarderName',
    render: (text) => text || '',
  },
  {
    title: 'Компания группы', // Group Company
    dataIndex: ['Forwarder', 'groupCompany'],
    key: 'groupCompany',
    render: (text) => text || '',
  },
  {
    title: 'ж/д тариф план', // Planned Railway Tariff
    dataIndex: ['Forwarder', 'plannedRailwayTariff'],
    key: 'plannedRailwayTariff',
    render: (text) => text || '',
  },
  {
    title: 'ж/д тариф факт', // Actual Railway Tariff
    dataIndex: ['Forwarder', 'actualRailwayTariff'],
    key: 'actualRailwayTariff',
    render: (text) => text || '',
  },
  {
    title: 'Фактически отгруженный объем, МТ',
    children: [
      {
        title: 'Дата',
        dataIndex: ['Forwarder', 'actualShippedVolumeMTDate'],
        key: 'actualShippedVolumeMTDate',
        render: (text) => (text ? <Text>{new Date(text).toLocaleDateString("ru-RU", {
          month: "2-digit",
          year: "numeric"
        }).replace(/\./g, "/")}</Text> : ''),
      },
      {
        title: 'Значение',
        dataIndex: ['Forwarder', 'actualShippedVolumeMT'],
        key: 'actualShippedVolumeMT',
      },
    ],
  },
  {
    title: 'Факт. объем по счету-фактуре, МТ',
    children: [
      {
        title: 'Дата',
        dataIndex: ['Forwarder', 'actualVolumeInvoiceMTDate'],
        key: 'actualVolumeInvoiceMTDate',
        render: (text) => (text ? <Text>{new Date(text).toLocaleDateString("ru-RU", {
          month: "2-digit",
          year: "numeric"
        }).replace(/\./g, "/")}</Text> : ''),
      },
      {
        title: 'Значение',
        dataIndex: ['Forwarder', 'actualVolumeInvoiceMT'],
        key: 'actualVolumeInvoiceMT',
      },
    ],
  },
  {
    title: 'Сумма по счету-фактуре на фактич. объем',
    children: [
      {
        title: 'Дата',
        dataIndex: ['Forwarder', 'invoiceAmountActualVolumeDate'],
        key: 'invoiceAmountActualVolumeDate',
        render: (text) => (text ? <Text>{new Date(text).toLocaleDateString("ru-RU", {
          month: "2-digit",
          year: "numeric"
        }).replace(/\./g, "/")}</Text> : ''),
      },
      {
        title: 'Значение',
        dataIndex: ['Forwarder', 'invoiceAmountActualVolume'],
        key: 'invoiceAmountActualVolume',
      },
    ],
  },
  {
    title: 'Охрана', // Security
    dataIndex: ['Forwarder', 'security'],
    key: 'security',
    render: (text) => text || '',
  },
  {
    title: 'Сверхнормативы (высокое)', // Excess High
    dataIndex: ['Forwarder', 'excessHigh'],
    key: 'excessHigh',
    render: (text) => text || '',
  },
  {
    title: 'Сверхнормативы (переведенное)', // Excess Transferred
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
      render: (text) => formatNumber(text),
  },
  {
      title: 'Дата загрузки', // Fill Date
      dataIndex: ['Forwarder', 'fillDate'],
      key: 'forwarderFillDate',
      render: (text) => (text ? <Text>{new Date(text).toLocaleDateString("ru-RU", {
        month: "2-digit",
        year: "numeric"
      }).replace(/\./g, "/")}</Text> : ''),
  },
]

const KGPassport = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapping, setMapping] = useState({})

  useEffect(() => {
    fetchColors();
    fetchDeals();
  }, []);

  useEffect(() => {
    const styleTag = document.createElement('style');
    let styles = '';
    Object.keys(mapping).forEach((fuelType) => {
      const color = mapping[fuelType];
      styles += `.row2-${fuelType} { background-color: ${color} !important; }\n`;
    });
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);

    // Cleanup: Remove the style tag on unmount
    return () => {
      document.head.removeChild(styleTag);
    };
  }, [mapping]);

  const fetchColors = async () => {
    try {
      const response = await refService.getRef("fuleType"); // Assuming `refService` is correctly defined
      const colorDictionary = response.data.reduce((acc, item) => {
        acc[item.name] = item.color;
        return acc;
      }, {});
      setMapping(colorDictionary)
    } catch (error) {
      message.error('Failed to fetch items');
    }
  };

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const { data } = await dealService.getDeals();
      setDeals(
        data
          .map((record, index) => ({ ...record, dealNumber: index + 1 }))
          .filter((deal) => deal.type === 'KG')
      );
    } catch (error) {
      localStorage.removeItem('token');
      notification.error({ message: 'Не удалось получить сделки!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="font-semibold text-2xl mb-4">KG Паспорт</h2>
          <Table
            className="overflow-x-auto"
            columns={columns}
            dataSource={deals}
            rowKey="dealNumber"
            bordered
            loading={loading}
            pagination={{ pageSize: 10 }}
            rowClassName={(record) => `row2-${record.fuelType}`}
          />
    </>
  );
};

export default KGPassport;