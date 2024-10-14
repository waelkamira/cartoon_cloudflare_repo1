class ImgurClientManager {
  constructor(clientIds) {
    this.clientIds = clientIds;
    this.usage = Array(clientIds.length).fill(0);
    this.limit = 50;
    this.resetInterval = 60 * 60 * 1000; // 1 hour
    setInterval(this.resetUsage.bind(this), this.resetInterval);
  }

  resetUsage() {
    this.usage = Array(this.clientIds.length).fill(0);
  }

  getClientId() {
    const availableIndex = this.usage.findIndex((count) => count < this.limit);
    if (availableIndex === -1) {
      throw new Error('All Client IDs have reached their limit');
    }
    this.usage[availableIndex]++;
    return this.clientIds[availableIndex];
  }
}

const clientIds = [
  '84dcc42c77c13ae',
  'd261a235ffb7b42',
  'fa14afe3ec50515',
  '91df45c419e88f1',
  'b0f2a6ca11cf97a',
  'f4e5fe134e2bf61',
  'b8a3ed9c0564af6',
  '66bc0b4e9afbeec',
  '51bac40ffdc021d',
  'aba6d61049df704',

  'afe7cd663114833',
  'c96595b05a8989e',
  'dbed62f246420c6',
  '52786f950a44082',
  '7f6a7a3b9d355b7',
  '561157ee542d9f5',
  '73431a4b7bb5ed0',
  '8a5943196650146',
  '2732501e00d7113',
  'ead751bd667f663',
  'bdc0b39a3027ff2',
  'f788bfef6e0497a',
  '0e5e7498da732e0',
  'd9cbb3d1423c087',
  '6f95ddb40071379',
  'b97db63eda77c30',
  '34859e75993e7a3',
  'ceaac45ee60faab',
  '33872b94b7df6e0',
  'b8e1cfe38064c35',
  '52731468f6ce6a0',
  'a10dde5ab9b85b0',
];

const imgurClientManager = new ImgurClientManager(clientIds);

export default imgurClientManager;
