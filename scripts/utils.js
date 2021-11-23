function getUrlForEnvironment(url) {
  const parsedUrl = new URL(url);
  const {
    protocol,
    hostname,
    port,
  } = document.location;

  parsedUrl.hostname = hostname;
  parsedUrl.protocol = protocol;
  parsedUrl.port = port;

  return parsedUrl.href;
}

export { getUrlForEnvironment };
