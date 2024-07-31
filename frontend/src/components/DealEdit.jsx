import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Radio, DatePicker } from 'antd';
import dayjs from 'dayjs';


const SupplierForm = ({initialValues, onChange}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                fillDate: initialValues?.fillDate ? initialValues.fillDate.split('T')[0] : ''
            })
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
        <Form.Item name="contractNumber" label="№ приложения и договор" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="volume" label="Законтрактовано по приложению / договору (объем)" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="amount" label="Сумма по приложению в долларах" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="deliveryBasis" label="Базис поставки/станция назначения" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="fixationCondition" label="Условие фиксации" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item label="Цена">
        <Form.Item name="quotation" label="Котировка" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name="discount" label="Скидка" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name="price" label="Цена" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
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

const BuyerForm = ({initialValues, onChange}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                dischargeDate: initialValues?.dischargeDate ? initialValues.dischargeDate.split('T')[0] : ''
            })
        }
    }, [initialValues])

    return (
        <Form
            initialValues={initialValues}
            onValuesChange={onChange}
            layout="vertical"
        >
        <Form.Item name="name" label="Наименование" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="contractNumber" label="№ приложения и договор" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="volume" label="Законтрактовано по приложению / договору (объем)" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="amount" label="Сумма по приложению в долларах" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="deliveryBasis" label="Базис поставки/станция назначения" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item name="fixationCondition" label="Условие фиксации" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item label="Цена">
        <Form.Item name="quotation" label="Котировка" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name="discount" label="Скидка" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name="price" label="Цена" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        </Form.Item>
        <Form.Item name="declared" label="Заявлено" rules={[{ required: true }]}>
        <Input />
        </Form.Item>
        <Form.Item label="Слив">
        <Form.Item name="dischargeVolume" label="Объем" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name="dischargeDate" label="Дата" rules={[{ required: true }]}>
            <Input type='date' />
        </Form.Item>
        </Form.Item>
    </Form>
    )
}

const ForwarderForm = ({initialValues, onChange}) => {
    return (
        <Form
        initialValues={initialValues}
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
        </Form>
    )
}

const CompanyForm = ({initialValues, onChange}) => {
    return (
        <Form
        initialValues={initialValues}
        onValuesChange={onChange}
        layout="vertical"
        >
                <Form.Item name="name" label="Наименование" rules={[{ required: true }]}>
                <   Input />
                </Form.Item>
                <Form.Item name="applicationNumber" label="# Приложения" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="price" label="Цена" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="comment" label="Коммент" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
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

    useEffect(() => {
        if (initialValues) {
            console.log(initialValues)
            const {dealNumber, date, factory, fuelType, sulfur, Supplier, Buyer, Forwarder, CompanyGroup} = initialValues
            form.setFieldsValue({dealNumber, date: dayjs(date), factory, fuelType, sulfur});
            
            setSupplier(Supplier)
            setBuyer(Buyer)
            setForwarder(Forwarder)
            setCompany(CompanyGroup)
        }
    }, [initialValues]);

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
            form.resetFields();
            onCancel();
        }}
        onOk={() => {
            form
            .validateFields()
            .then((values) => {
                form.resetFields();
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
            <Input type='number' disabled={!!initialValues} />
            </Form.Item>
            <Form.Item name="date" label="Дата" rules={[{ required: true }]}>
            <DatePicker picker='month' />
            </Form.Item>
            <Form.Item name="factory" label="Завод" rules={[{ required: true }]}>
            <Input />
            </Form.Item>
            <Form.Item name="fuelType" label="Вид ГСМ" rules={[{ required: true }]}>
            <Input />
            </Form.Item>
            <Form.Item name="sulfur" label="% Серы" rules={[{ required: true }]}>
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