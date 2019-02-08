import moment from 'moment'

function date(value, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!value) {
    return ''
  }

  let date = value
  if (!(value instanceof Date)) {
    date = new Date(value)
  }

  if (isNaN(date.getTime())) {
    return value
  }

  return moment(date).format(format)
}

export default date