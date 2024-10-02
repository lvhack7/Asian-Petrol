import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Radio, DatePicker, Select, Space, Button, Row, Col, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ru';
import refService from '../services/refService';

dayjs.extend(utc); // Extend dayjs with UTC plugin
dayjs.locale('ru');

const SupplierForm = ({initialValues, onChange}) => {
    const [form] = Form.useForm();
    const [suppliers, setSupplier] = useState([])
    const [currencies, setCurr] = useState([])
    const [deliveryBas, setDel] = useState([])
    const [fixation, setFix] = useState([])

    useEffect(() => {
        fetchSuppliers()
    }, [])

    const fetchSuppliers = async () => {
        try {
            const fetchSupp = await refService.getRef("supplier")
            const fetchCurr = await refService.getRef("currency")
            const fetchFix = await refService.getRef("fixationCondition")
            const fetchDel = await refService.getRef("deliveryBasis")

            setSupplier(fetchSupp.data)
            setCurr(fetchCurr.data)
            setFix(fetchFix.data)
            setDel(fetchDel.data)
        } catch(e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (initialValues) {
            console.log("IN2: ", initialValues)
            const validatedInitialValues = initialValues?.Tonns?.map((item) => ({
                ...item,
                date: item?.date ? dayjs.utc(item.date) : null,  // Convert to dayjs if valid, otherwise set to null
            }));

            form.setFieldsValue({
                ...initialValues,
                amount: initialValues?.Prices?.length > 0 ? Number(initialValues?.Prices[0]?.price) * Number(initialValues?.volume) : '',
                fillDate: initialValues?.fillDate ? dayjs.utc(initialValues.fillDate) : null,
                Tonns: validatedInitialValues
            })
        } else {
            form.resetFields()
        }
    }, [initialValues])

    return (
        <Form
        form={form}
        onValuesChange={onChange}
        layout="vertical"
    >
        <Form.Item name="name" label="Поставщик" rules={[{ required: true }]}>
            <Select placeholder="Выберите поставщик">
                {suppliers.map(factory => (
                    <Select.Option key={factory.id} value={factory.name}>
                        {factory.name}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
        <Form.Item name="contractNumber" label="№ приложения и договор" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="volume" label="Законтрактовано по приложению / договору (объем)" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="amount" label="Сумма по приложению" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="deliveryBasis" label="Базис поставки/станция назначения" rules={[{ required: true }]}>
        <Select placeholder="Выберите Базис поставки">
                {deliveryBas.map(factory => (
                    <Select.Option key={factory.id} value={factory.name}>
                        {factory.name}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
        <Form.Item name="fixationCondition" label="Условие фиксации" rules={[{ required: true }]}>
        <Select placeholder="Выберите Условие фиксации">
                {fixation.map(factory => (
                    <Select.Option key={factory.id} value={factory.name}>
                        {factory.name}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
        <Form.List name="Prices">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div className='flex flex-col'>
                    <label className='col-span-2 mb-2 font-medium'>Цена</label>
                    <Space key={key} className='grid grid-cols-2 gap-4' align="baseline">
                    <Form.Item
                        {...restField}
                        name={[name, 'quotation']}
                        fieldKey={[fieldKey, 'quotation']}
                        label="Котировка"
                        rules={[{ required: true, message: 'Введите котировку' }]}
                    >
                        <Input placeholder="Котировка" />
                    </Form.Item>
                    <Form.Item
                        {...restField}
                        name={[name, 'discount']}
                        fieldKey={[fieldKey, 'discount']}
                        label="Скидка"
                        rules={[{ required: true, message: 'Введите скидку' }]}
                    >
                    <Input placeholder="Скидка" />
                    </Form.Item>
                    <Form.Item
                    {...restField}
                    name={[name, 'price']}
                    fieldKey={[fieldKey, 'price']}
                    label="Цена"
                    rules={[{ required: true, message: 'Введите цену' }]}
                    >
                    <Input placeholder="Цена" />
                    </Form.Item>
                    <Form.Item
                    {...restField}
                    name={[name, 'currency']}
                    fieldKey={[fieldKey, 'currency']}
                    label="Валюта"
                    rules={[{ required: true, message: 'Выберите валюту' }]}
                    >
                    <Select placeholder="Выберите валюту">
                        {currencies.map(currency => (
                        <Select.Option key={currency.id} value={currency.name}>
                            {currency.name}
                        </Select.Option>
                        ))}
                    </Select>
                    </Form.Item>
                    <Form.Item
                    {...restField}
                    name={[name, 'commentary']}
                    fieldKey={[fieldKey, 'commentary']}
                    label="Комментарии"
                    rules={[{ required: true, message: 'Введите комментарии' }]}
                    >
                    <Input placeholder="Комментарии" />
                    </Form.Item>
                    <Button
                  type="danger"
                  className='text-red-500'
                  onClick={() => remove(name)}
                >
                  Удалить
                </Button>
                </Space>
                </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Добавить цену
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.List name="Tonns">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Form.Item label="Налив">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item 
                                {...restField}
                                name={[name, 'tonn']}
                                fieldKey={[fieldKey, 'tonn']}
                                label="Тоннаж" 
                                rules={[{ required: true, message: 'Please enter the tonnage' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...restField}
                                name={[name, 'date']}
                                fieldKey={[fieldKey, 'date']} 
                                label="Дата" 
                                rules={[{ required: true, message: 'Please enter the date',  }, 
                                ]}>
                                <DatePicker
                                    className='w-full'
                                />
                            </Form.Item>
                        </Col>
                        <Button
                            type="danger"
                            className='text-red-500'
                            onClick={() => remove(name)}
                            >
                            Удалить
                        </Button>
                    </Row>
                </Form.Item>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Добавить Налив
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
    )
}

const BuyerForm = ({initialValues, onChange}) => {
    const [form] = Form.useForm();
    const [suppliers, setSupplier] = useState([])
    const [currencies, setCurr] = useState([])
    const [deliveryBas, setDel] = useState([])
    const [fixation, setFix] = useState([])

    useEffect(() => {
        fetchSuppliers()
    }, [])

    const fetchSuppliers = async () => {
        try {
            const fetchSupp = await refService.getRef("buyer")
            const fetchCurr = await refService.getRef("currency")
            const fetchFix = await refService.getRef("fixationCondition")
            const fetchDel = await refService.getRef("deliveryBasis")

            setSupplier(fetchSupp.data)
            setCurr(fetchCurr.data)
            setFix(fetchFix.data)
            setDel(fetchDel.data)
        } catch(e) {
            console.log(e)
        }
    }

    useEffect(() => {
        console.log("INIT: ", initialValues)
        if (initialValues) {
            const validatedInitialValues = initialValues?.Tonns?.map((item) => ({
                ...item,
                date: item?.date ? dayjs.utc(item.date) : null,  // Convert to dayjs if valid, otherwise set to null
            }));

            const updatedValues = {
                ...initialValues,
                amount: initialValues?.Prices?.length > 0 ? Number(initialValues?.Prices[0]?.price) * Number(initialValues?.volume) : '',
                dischargeDate: initialValues?.dischargeDate ? dayjs.utc(initialValues?.dischargeDate) : null,
                fillDate: initialValues?.fillDate ? dayjs.utc(initialValues?.fillDate) : null,
                Tonns: validatedInitialValues
            }
            form.setFieldsValue(updatedValues)
        } else {
            form.resetFields()
        }
    }, [initialValues])

    return (
        <Form  
            form={form}
            onValuesChange={onChange}
            layout="vertical"
        >
        <Form.Item name="name" label="Покупатель" rules={[{ required: true }]}>
            <Select placeholder="Выберите покупатель">
                {suppliers.map(factory => (
                    <Select.Option key={factory.id} value={factory.name}>
                        {factory.name}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
        <Form.Item name="contractNumber" label="№ приложения и договор" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="volume" label="Законтрактовано по приложению / договору (объем)" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="amount" label="Сумма по приложению" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="deliveryBasis" label="Базис поставки/станция назначения" rules={[{ required: true }]}>
        <Select placeholder="Выберите Базис поставки">
                {deliveryBas.map(factory => (
                    <Select.Option key={factory.id} value={factory.name}>
                        {factory.name}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
        <Form.Item name="fixationCondition" label="Условие фиксации" rules={[{ required: true }]}>
        <Select placeholder="Выберите Условие фиксации">
                {fixation.map(factory => (
                    <Select.Option key={factory.id} value={factory.name}>
                        {factory.name}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
        <Form.Item name="declared" label="Заявлено" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.List name="Prices">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div className='flex flex-col'>
                    <label className='col-span-2 mb-2 font-medium'>Цена</label>
                    <Space key={key} className='grid grid-cols-2 gap-4' align="baseline">
                    <Form.Item
                        {...restField}
                        name={[name, 'quotation']}
                        fieldKey={[fieldKey, 'quotation']}
                        label="Котировка"
                        rules={[{ required: true, message: 'Введите котировку' }]}
                    >
                        <Input placeholder="Котировка" />
                    </Form.Item>
                    <Form.Item
                        {...restField}
                        name={[name, 'discount']}
                        fieldKey={[fieldKey, 'discount']}
                        label="Скидка"
                        rules={[{ required: true, message: 'Введите скидку' }]}
                    >
                    <Input placeholder="Скидка" />
                    </Form.Item>
                    <Form.Item
                    {...restField}
                    name={[name, 'price']}
                    fieldKey={[fieldKey, 'price']}
                    label="Цена"
                    rules={[{ required: true, message: 'Введите цену' }]}
                    >
                    <Input placeholder="Цена" />
                    </Form.Item>
                    <Form.Item
                    {...restField}
                    name={[name, 'currency']}
                    fieldKey={[fieldKey, 'currency']}
                    label="Валюта"
                    rules={[{ required: true, message: 'Выберите валюту' }]}
                    >
                    <Select placeholder="Выберите валюту">
                        {currencies.map(currency => (
                        <Select.Option key={currency.id} value={currency.name}>
                            {currency.name}
                        </Select.Option>
                        ))}
                    </Select>
                    </Form.Item>
                    <Form.Item
                    {...restField}
                    name={[name, 'commentary']}
                    fieldKey={[fieldKey, 'commentary']}
                    label="Комментарии"
                    rules={[{ required: true, message: 'Введите комментарии' }]}
                    >
                    <Input placeholder="Комментарии" />
                    </Form.Item>
                    <Button
                  type="danger"
                  className='text-red-500'
                  onClick={() => remove(name)}
                >
                  Удалить
                </Button>
                </Space>
                </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Добавить цену
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <Form.List name="Tonns">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Form.Item label="Отгрузка">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item 
                                {...restField}
                                name={[name, 'tonn']}
                                fieldKey={[fieldKey, 'tonn']}
                                label="Тоннаж" 
                                rules={[{ required: true, message: 'Please enter the tonnage' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                {...restField}
                                name={[name, 'date']}
                                fieldKey={[fieldKey, 'date']} 
                                label="Дата" 
                                rules={[{ required: true, message: 'Please enter the date',  }, 
                                ]}>
                                <DatePicker
                                    className='w-full'
                                />
                            </Form.Item>
                        </Col>
                        <Button
                            type="danger"
                            className='text-red-500'
                            onClick={() => remove(name)}
                            >
                            Удалить
                        </Button>
                    </Row>
                </Form.Item>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Добавить Отгрузку
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
    )
}

const ForwarderForm = ({initialValues, onChange}) => {
    const [form] = Form.useForm()

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues)
        } else {
            form.resetFields()
        }
    }, [initialValues])

    return (
        <Form
        form={form}
        onValuesChange={onChange}
        layout="vertical"
        >
                <Form.Item name="name" label="Наименование" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
                <Form.Item name="groupCompany" label="Компания группы" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
                <Form.Item name="plannedRailwayTariff" label="Ж/Д тариф план" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
                <Form.Item name="cargoAmountMT" label="Кол-во груза, МТ" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
                <Form.Item name="accruedAmount" label="Сумма начисленная" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
                <Form.Item name="actualRailwayTariff" label="Ж/Д тариф факт" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
                <Form.Item name="actualShippedVolumeMT" label="Фактически отгруженный объем, МТ" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
                <Form.Item name="actualVolumeInvoiceMT" label="Факт. объем по счету-фактуре, МТ" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
                <Form.Item name="invoiceAmountActualVolume" label="Сумма по счету-фактуре на фактич. объем" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
                <Form.Item name="security" label="Охрана" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
                <Form.Item label="Сверхнормативы">
                <Form.Item name="excessHigh" label="Выс-но" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="excessTransferred" label="Пере-но" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                </Form.Item>
                <Form.Item label="Штрафы">
                <Form.Item name="penaltiesHigh" label="Выс-но" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="penaltiesTransferred" label="Пере-но" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                </Form.Item>
                <Form.Item name="additionalCosts" label="Доп расходы" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
                <Form.Item label="Налив">
                    <Form.Item name="volumeFilled" label="Объем" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="fillDate" label="Дата" rules={[{ required: true }]}>
                        <Input type='date' />
                    </Form.Item>
                </Form.Item>
        </Form>
    )
}

const CompanyForm = ({initialValues, onChange}) => {
    const [form] = Form.useForm()
    const [company, setCompany] = useState([])
    const [currencies, setCurr] = useState([])

    useEffect(() => {
        fetchSuppliers()
    }, [])

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                names: parseCommaSeparatedString(initialValues.names)
            })
        } else {
            form.resetFields()
        }
        fetchCompany()
    }, [initialValues])

    const fetchSuppliers = async () => {
        try {
            const fetchCurr = await refService.getRef("currency")

            setCurr(fetchCurr.data)
        } catch(e) {
            console.log(e)
        }
    }

    const parseCommaSeparatedString = (str) => {
        // Ensure str is a string before using split
        console.log(str)
        return typeof str === 'string' ? str.split(',').map(name => ({ name })) : str.map(item => ({name: item?.name || ''}));
    };
    
    // Convert an array of objects to a comma-separated string for form submissio

    const fetchCompany = async () => {
        try {
            const fetchComp = await refService.getRef("company")

            setCompany(fetchComp.data)
        } catch(e) {
            console.log(e)
        }
    }

    return (
        <Form
        form={form}
        onValuesChange={onChange}
        layout="vertical"
        >
                <Form.List name="names">
                    {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Space key={key} className='flex items-center space-x-4' align="baseline">
                            <Form.Item
                                {...restField}
                                name={[name, 'name']}
                                fieldKey={[fieldKey, 'name']}
                                label="Группа компании"
                                rules={[{ required: true, message: 'Пожалуйста, выберите Группу компании!' }]}
                            >
                            <Select placeholder="Выберите группу компании">
                                {company.map(factory => (
                                <Select.Option key={factory.id} value={factory.name}>
                                    {factory.name}
                                </Select.Option>
                                ))}
                            </Select>
                            </Form.Item>
                            <Button
                                type="danger"
                                className='text-red-500'
                                onClick={() => remove(name)}
                            >
                            Удалить
                            </Button>
                        </Space>
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                            >
                                Добавить группу компании
                            </Button>
                        </Form.Item>
                    </>
                    )}
                </Form.List>
                <Form.Item name="applicationNumber" label="# Приложения" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="comment" label="Коммент" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.List name="Prices">
                    {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                            <div className='flex flex-col'>
                                <label className='col-span-2 mb-2 font-medium'>Цена</label>
                                <Space key={key} className='grid grid-cols-2 gap-4' align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'quotation']}
                                    fieldKey={[fieldKey, 'quotation']}
                                    label="Котировка"
                                    rules={[{ required: true, message: 'Введите котировку' }]}
                                >
                                    <Input placeholder="Котировка" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'discount']}
                                    fieldKey={[fieldKey, 'discount']}
                                    label="Скидка"
                                    rules={[{ required: true, message: 'Введите скидку' }]}
                                >
                                <Input placeholder="Скидка" />
                                </Form.Item>
                                <Form.Item
                                {...restField}
                                name={[name, 'price']}
                                fieldKey={[fieldKey, 'price']}
                                label="Цена"
                                rules={[{ required: true, message: 'Введите цену' }]}
                                >
                                <Input placeholder="Цена" />
                                </Form.Item>
                                <Form.Item
                                {...restField}
                                name={[name, 'currency']}
                                fieldKey={[fieldKey, 'currency']}
                                label="Валюта"
                                rules={[{ required: true, message: 'Выберите валюту' }]}
                                >
                                <Select placeholder="Выберите валюту">
                                    {currencies.map(currency => (
                                    <Select.Option key={currency.id} value={currency.name}>
                                        {currency.name}
                                    </Select.Option>
                                    ))}
                                </Select>
                                </Form.Item>
                                <Form.Item
                                {...restField}
                                name={[name, 'commentary']}
                                fieldKey={[fieldKey, 'commentary']}
                                label="Комментарии"
                                rules={[{ required: true, message: 'Введите комментарии' }]}
                                >
                                <Input placeholder="Комментарии" />
                                </Form.Item>
                                <Button
                            type="danger"
                            className='text-red-500'
                            onClick={() => remove(name)}
                            >
                            Удалить
                            </Button>
                            </Space>
                            </div>
                        ))}
                        <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Добавить цену
                        </Button>
                        </Form.Item>
                    </>
                    )}
                </Form.List>
        </Form>
    )
}


const DealEdit = ({ visible, onCreate, onCancel, initialValues }) => {
    const [form] = Form.useForm();
    const [formType, setFormType] = useState('supplier'); // Default to supplier form
    const [supplier, setSupplier] = useState(null)
    const [buyer, setBuyer] = useState(null)
    const [forwarder, setForwarder] = useState(null)
    const [company, setCompany] = useState(null)
    const [fuelTypes, setFuel] = useState([])
    const [factories, setFactories] = useState([])


    useEffect(() => {
        if (initialValues) {
            console.log(initialValues)
            const {dealNumber, date, factory, fuelType, type, sulfur, Supplier, Buyer, Forwarder, CompanyGroup} = initialValues
            form.setFieldsValue({dealNumber, date: date ? dayjs(date) : null, factory, fuelType, sulfur, type});
            
            setSupplier(Supplier)
            setBuyer(Buyer)
            setForwarder(Forwarder)
            setCompany(CompanyGroup)
        } else {
            form.resetFields()
        }

        fetchItems()
    }, [initialValues, form]);

    const fetchItems = async () => {
        try {
        const fetchFuel = await refService.getRef("fuleType")
        const fetchFact = await refService.getRef("factory")

        setFuel(fetchFuel.data)
        setFactories(fetchFact.data)
        } catch(e) {
        console.log(e)
        }
    }

    const handleFormTypeChange = (e) => {
        setFormType(e.target.value);
    };

    return (
        <Modal
        visible={visible}
        title='Обновить сделку'
        okText='Обновить'
        cancelText="Отменить"
        onCancel={() => {
            setSupplier(null)
            setBuyer(null)
            setForwarder(null)
            setCompany(null)

            onCancel();
        }}
        onOk={() => {
            form
            .validateFields()
            .then((values) => {
                const obj = {header: {...values, date: dayjs(values.date).startOf('month').toISOString()}, supplier, buyer, forwarder, company}
                onCreate(obj);
            })
            .catch((err) => {
                console.error('Validation failed:', err);
            });
        }}
        >
        <Form form={form} layout="vertical">
            <Form.Item name="dealNumber" label="# Сделки" rules={[{ required: true }]}>
                <Input 
                    type='number'
                    disabled={!!initialValues}
                    addonBefore={
                        <Typography.Text>
                          {form.getFieldValue('type')}  {/* Display the type as static text */}
                        </Typography.Text>
                    }   
                />
            </Form.Item>
            <Form.Item name="date" label="Дата" rules={[{ required: true }]}>
            <DatePicker picker='month' />
            </Form.Item>
            <Form.Item name="factory" label="Завод" rules={[{ required: true }]}>
                <Select placeholder="Выберите завод">
                    {factories.map(factory => (
                        <Select.Option key={factory.id} value={factory.name}>
                            {factory.name}
                        </Select.Option>
                    ))}
                </Select>
                </Form.Item>
                <Form.Item name="fuelType" label="Вид ГСМ" rules={[{ required: true }]}>
                <Select placeholder="Select a fuel type">
                    {fuelTypes.map(fuel => (
                        <Select.Option key={fuel.id} value={fuel.name}>
                            {fuel.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="sulfur" label="% Серы" rules={[{ required: false }]}>
            <Input />
            </Form.Item>

            <Form.Item label="Выберите тип:">
            <Radio.Group onChange={handleFormTypeChange} value={formType}>
                <Radio value="supplier">Поставщик</Radio>
                <Radio value="buyer">Покупатель</Radio>
                <Radio value="forwarder">Экспедитор</Radio>
                <Radio value="company">Группа компании</Radio>
            </Radio.Group>
            </Form.Item>

            {formType === 'supplier' && (
                <SupplierForm
                    initialValues={supplier}
                    onChange={(_, allValues) => setSupplier(allValues)}
                />
            )}

            {formType === 'buyer' && (
                <BuyerForm
                initialValues={buyer}
                onChange={(_, allValues) => setBuyer(allValues)}
                />
            )}

            {formType === 'forwarder' && (
                <ForwarderForm
                initialValues={forwarder}
                onChange={(_, allValues) => setForwarder(allValues)}
                />
            )}

            {formType === 'company' && (
                <CompanyForm
                    initialValues={company}
                    onChange={(_, allValues) => setCompany(allValues)}
                />
            )}
        </Form>
        </Modal>
    );
};

export default DealEdit;