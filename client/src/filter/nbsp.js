function nbsp(word) {
  if (!word) {
    return '<br>'
  }
  return word.replace(/ /g, '&nbsp;').replace(/	/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
}

export default nbsp