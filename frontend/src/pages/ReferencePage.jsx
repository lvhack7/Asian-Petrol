import React from 'react'
import RefForm from '../components/RefForm'


const references = [
  {
    field: "factory",
    title: "Завод"
  },
  {
    field: "fuleType",
    title: "Вид ГСМ",
    color: true
  },
  {
    field: "supplier",
    title: "Поставщик"
  },
  {
    field: "buyer",
    title: "Покупатель"
  },
  {
    field: "company",
    title: "Группа компании"
  },
  {
    field: "deliveryBasis",
    title: "Базис поставки"
  },
  {
    field: "fixationCondition",
    title: "Условия фиксации"
  },
  {
    field: "currency",
    title: "Валюта"
  },
  {
    field: "stations",
    title: "Станция назначения"
  },
]

export const ReferencePage = () => {
  return (
    <div className='flex items-start flex-wrap gap-20'>
      {
        references.map(ref => <RefForm field={ref.field} title={ref.title} color={ref?.color || false} />)
      }
    </div>
  )
}
