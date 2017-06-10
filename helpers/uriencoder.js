const fixedURIComponent = ((str) => {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
});

module.exports = fixedURIComponent;
