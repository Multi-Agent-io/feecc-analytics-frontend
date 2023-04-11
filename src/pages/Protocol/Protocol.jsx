/* TODO: 
+ better status showing. You can show it in statusbar, not alert
+ better detecting user leaves page (now only reload is detected)
+ replace alerts with soft messages within page
*/

import React, { useState, useEffect, useRef } from "react";
import './protocol.scoped.css';
import check from '../../assets/check.svg';

import { history } from "../../store/main";

import PrintButton from "../../components/PrintButton/PrintButton";
import ButtonBack from '../../components/ButtonBack/ButtonBack';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import conf from '../../config.json';

let initialData = null; /* for comparing with changes */
let initialSerial = null; /* for comparing with changes */

const Protocol = () => {
  /* Data */
  const [serialNumber, setSerialNumber] = useState('');
  const [employee, setEmployee] = useState(null);
  const [selectedProtocol, setSelectedProtocol] = useState(null); /* protocol_schema_id */
  const [allProtocols, setAllProtocols] = useState(null); /* Object */
  const [protocol, setProtocol] = useState(null); /* selected protocol data */
  const internal_id = history.location.pathname.split('/')[3]; /* Get initial id for fetching */

  /* States */
  const [isLoading, setIsLoading] = useState(true);
  const [isEdited, setIsEdited] = useState(false);
  const [submitText, setSubmitText] = useState('Cохранить');
  const [checkedAll, setCheckedAll] = useState(null); /* We use it on submit checks and for buttom 'протокол отметить всё' */
  let fetched = false;

  const dynamicTitle = title => {
    if(title) {
      document.title = 'Протокол: ' + title
    }
  }

  useEffect(async () => {

      if(!fetched) {
        fetched = true
        setIsLoading(true)

        const response = await fetch(`${conf.base_url}/api/v1/tcd/protocols/${internal_id}`,{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        })
        const res = await response.json()

        if(response) {
          setIsLoading(false)
        }

        if(res?.detail === 'Success') {

          if(res?.protocol) {
            setAllProtocols(res.protocol)
            initialData = JSON.parse(JSON.stringify(res.protocol))

            if(res.protocol?.status === 'Вторая стадия испытаний пройдена') {
              setSubmitText('Сохранить')
            } else {
              setSubmitText('Подтвердить и отправить')
            }
          }
          
          /* + Detect selected protocol id */
          if (!res?.protocol?.protocols) {
            setSelectedProtocol(res.protocol?.protocol_schema_id)
            setProtocol(res.protocol)
            dynamicTitle(res.protocol?.protocol_name)
          } else {
            setSelectedProtocol(res?.protocol.protocols[0]?.protocol_schema_id)
            const findSelected = res?.protocol?.protocols.find( o => { return o.protocol_schema_id === res?.protocol.protocols[0]?.protocol_schema_id })
            setProtocol(findSelected)
            dynamicTitle(findSelected?.protocol_name)
          }
          
          if(res?.serial_number || res?.serial_number ==='') {
            setSerialNumber(res.serial_number)
            initialSerial = res.serial_number
          }

          if(res?.employee) {
            setEmployee(res?.employee)
          }
          
        }
      }
    

    return () => {
      window.onbeforeunload = () => null // clear event listener for defence from reloading (from checkAllHandler)
    }

  }, [])

  useEffect( () => {

    if(initialData) {
      setIsEdited(JSON.stringify(initialData) != JSON.stringify(allProtocols))
    }
    
  }, [allProtocols])


  useEffect( () => {

    if(initialSerial || initialSerial==='') {
      setIsEdited(initialSerial != serialNumber)
    }
    
  }, [serialNumber])
  

  /* Update data when selected protocol data changed */
  useEffect(() => {
    if(allProtocols?.protocols) {
      let buffer = Object.assign({}, allProtocols)
      buffer.protocols.map( o => {
        if(o.protocol_schema_id === selectedProtocol) {
          return protocol
        }
      })
      setAllProtocols(buffer)
    } else {
      setAllProtocols(protocol)
    }

    /* Force update for inputs when change protocol type */
    const inputs = document.querySelectorAll('[data-handle]')
    if(inputs) {
      let inputsCount = 0

      inputs.forEach( i => {
        if(i.dataset.handleIndex && i.dataset.handleType) {
          if(i.type === 'checkbox') {
            i.checked = protocol.rows[i.dataset.handleIndex][i.dataset.handleType]
            if(i.checked) {
             inputsCount++
            }
          } else {
            i.value = protocol.rows[i.dataset.handleIndex][i.dataset.handleType]
          }
          
        }
      })

      /* Reset checkedAll status */
      const inputsChecked = document.querySelectorAll('[data-handle-type="checked"]')
      if((inputsCount == inputsChecked.length) && (inputsChecked.length > 0)) {
        setCheckedAll(true)
      } else {
        setCheckedAll(false)
      }
    }

  }, [protocol])


  /* Select protocol */
  /* Detect how much protocols we have and show text name or select */
  const handleSelectedProtocol = e => {
    const selected = e.target.value
    const findSelected = allProtocols.protocols.find( o => { return o.protocol_schema_id === selected })

    setSelectedProtocol(selected)
    setProtocol(findSelected)
  }
  const detailChoose = () => {
    if(allProtocols?.protocols?.length > 0) {
      return (
        <select className="protocol-header-title-detail" value={selectedProtocol} onChange={handleSelectedProtocol}>
          {allProtocols.protocols.map(({ protocol_schema_id, protocol_name }, index) => <option value={protocol_schema_id} >{protocol_name}</option>)}
        </select>
      )
    } else {
      return (
        <>
          <div className="protocol-header-title-detail">{protocol?.protocol_name}</div>
        </>
      )
    }
  }

  /* Serial number */
  const serialNumberHandler = e => {
    setSerialNumber(e.target.value)
  }

  /* Header of protocol */
  const showTitle = () => {
    if(!isLoading && protocol) {
      return (
        <>
          
          <h1>Протокол приёмо-сдаточных испытаний <span class="print-only">№__-В</span></h1>
          
          { detailChoose() }
          <div>SN: {protocol?.default_serial_number ?? '941619006'}-
            <input 
              className="width-ch6"
              onChange={serialNumberHandler}
              value={serialNumber}
              placeholder = "000000"
            />
          </div>
        </>
      )
    } else {
      return (
        <h1>Протокол приёмо-сдаточных испытаний</h1>
      )
    }
  }

  /* + Table with protocol data */
  const showData = () => {

      if(protocol?.rows) {
        return (
          <>
            <table>
              <thead>
                <tr>
                  <th rowSpan={2}>Наименование параметра (показателя)</th>
                  <th colSpan={2}>Значение параметра</th>
                  <th rowSpan={2}>Первичное испытание</th>
                  <th rowSpan={2}>Вторичное испытание</th>
                  <th rowSpan={2}>
                    Проверено
                    <div>
                      <a href="javascript:;" class="link screen-only" onClick={handleCheckAll}>
                        {checkedAll ? 'Очистить' : 'Всё' }
                      </a>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th>Номинальное значение</th>
                  <th>Предельное отклонение</th>
                </tr>
              </thead>

              {showDataLines(protocol.rows)}
              
            </table>

            <div class="print-only">{showStatus}</div>
          </>
          
        )
      }
    
  }

  const showDataLines = data => {

    let result = []
    
    if(data) {
      
      result = data.map((row, index) => {

        return (
          <tr className={row.checked ? 'checked' : 'not-checked'}>
            <td key={`name-${index}`}><b>{row.name}</b></td>
            <td key={`value-${index}`}>{row.value}</td>
            <td key={`deviation-${index}`}>{row.deviation}</td>
            <td class="protocol-tablecell-input">
              <span className={row.test1 ? 'print-only ' : 'print-only nowrap'}>{row.test1 ? row.test1 : 'Не проводилось'}</span>
              <input
                  type='text'
                  key = {`test1-${index}`}
                  id = {`test1-${index}`}
                  defaultValue={row.test1}
                  data-handle={selectedProtocol}
                  data-handle-type='test1'
                  data-handle-index={index}
                  placeholder='Введите значение'
                  disabled={protocol?.status === "Протокол утверждён"}
                  onBlur={handleInputProtocolData}
                  class="screen-only"
              />
            </td>
            <td class="protocol-tablecell-input">
              <span className={row.test1 ? 'print-only ' : 'print-only nowrap'}>{row.test2 ? row.test2 : 'Не проводилось'}</span>
              <input
                  type='text'
                  key = {`test2-${index}`}
                  id = {`test2-${index}`}
                  defaultValue={row.test2}
                  data-handle={selectedProtocol}
                  data-handle-type='test2'
                  data-handle-index={index}
                  placeholder='Введите значение'
                  disabled={protocol?.status === "Протокол утверждён"}
                  onBlur={handleInputProtocolData}
                  class="screen-only"
              />
            </td>
            <td>
              <div class="checkbox">
                <input 
                  type='checkbox'
                  data-handle={selectedProtocol}
                  data-handle-type='checked'
                  data-handle-index={index}
                  id={`checked-${index}`} 
                  disabled={protocol?.status === "Протокол утверждён"}
                  defaultChecked={checkedAll ? checkedAll : row.checked}
                  onChange={handleInputProtocolData}
                />
                <label for={`checked-${index}`}><img src={check} /></label>
              </div>
            </td>
          </tr>
        )
      })

      return (
        <tbody>{result}</tbody>
      )
    } else {
      return(
        'Данные по протоколу не загрузились'
      )
    }
  }

  const handleCheckAll = () => {

    let status = false

    if(!checkedAll) {
      setCheckedAll(true)
      status = true
    } else {
      setCheckedAll(false)
    }

    let buffer
    buffer = Object.assign({}, protocol)

    buffer.rows.forEach( i => {
      i.checked = status
    })

    setProtocol(buffer)
  }

  const handleInputProtocolData = event => {

    window.onbeforeunload = () => true // defense from user's reload
    
    const e = event.target
    let targetValue = e.type === "checkbox" ? e.checked : e.value
    const index = e.dataset.handleIndex
    const place = e.dataset.handleType

    /* Set null if user entered something and than cleared. We need this for correct isEdited state */
    if(e.type === 'text' && e.value === '') {
      targetValue = null
    }

    if(protocol?.rows){
      let buffer = Object.assign({}, protocol)
      buffer.rows[index][place] = targetValue
      setProtocol(buffer)
    }
    
  }


  /* + If got employee, show this */
  const showEmployee = () => {
    if(employee) {
      return (
        <div><b>Испытания провёл:<br/> {employee?.position}<br/> {employee?.name}</b></div>
      )
    }
  }

  /* + If got status of protocl, show this */
  const showStatus = () => {
    if(protocol?.status) {
      return (
        <div class="protocol-status"><div class="protocol-status-title">Статус: </div> {protocol.status}</div>
      )
    }
  }

  /* Controls panel with action buttons */
  const showControls = () => {
    return (
      <div className='protocol-controls'>

        <div className='protocol-controls-section'>
          { showStatus() }
          <Button 
            onClick={routePassport} 
            size='medium'
          >Паспорт</Button>
        </div>

        
        <div className='protocol-controls-section'>
          {protocol?.status !== "Протокол утверждён" &&
            <>
              <Button 
                primary 
                onClick={submitDataHandler}
                disabled={!isEdited}
                size='medium'
              >
                {submitText}
              </Button>
            </>
          }
        </div>
      </div>
    )
  }

  /* + Routing */
  const routePassport = () => {
    history.push(`/passport/${internal_id}/edit`)
  }
  /* - Routing */

  
  const submitDataHandler = () => {

    setSubmitText('Идёт сохранение')

    let confirmSerialEmpty = true
    if(!serialNumber){
      confirmSerialEmpty = window.confirm("Внимание вы не заполнили серийный номер!")
    }

    if(confirmSerialEmpty) {
      fetch(`${conf.base_url}/api/v1/passports/${internal_id}/serial?serial_number=${serialNumber}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((res)=> {
        res.ok ? alert("Серийный номер отправлен!") : alert("Что-то пошло не так серийного номера!")
      })
    }

    let confirmNotAllChecked = true
    if(!checkedAll){
      confirmNotAllChecked = window.confirm("Внимание вы не проверили все поля! Вы хотите продолжить?")
    }

    if(confirmNotAllChecked) {
      fetch(`${conf.base_url}/api/v1/tcd/protocols/${internal_id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(protocol)
      })
      .then((res)=> {
        res.ok ? alert("Протокол успешно отправлен!") : alert("Что-то пошло не так c отправкой протокола!");
        if(res?.status === 403) {
          alert("У вас недостаточно прав для отправки протокола!")
        }
      }).then(()=> {
        window.onbeforeunload = () => null;
        window.location.reload(true);
      })
    }

  }

  const fetchContent = () => {
    if(isLoading) {
      return (
        <Loader />
      )
    } else {
      return (
        <>
          <section className="protocol-contentblock">
            { showData() }
          </section>

          <section className="protocol-contentblock">
            { showEmployee() }
          </section>

          <section className="protocol-contentblock">
            { showControls() }
          </section>
        </>
      )
    }
  }

  /* Show some messages with status */
  const showStatusBar = () => {
    if(isEdited) {
      return (
        <div class="label screen-only">Есть несохранённые изменения</div>
      )
    }
  }
  
  return (
    <>
      {showStatusBar()}
      
      <header role="banner" className="protocol-header">
        <div className="protocol-header-content">
          <ButtonBack/>

          <section className="protocol-header-title">
              { showTitle() }
          </section>
          
          <PrintButton disabled={isLoading} />
        </div>
      </header>

      { fetchContent() }

    </>
  )
}

export default Protocol
