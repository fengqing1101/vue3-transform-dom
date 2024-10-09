import { TransferToWindow } from 'transfer-to-window';
/**
 * 创建一个默认的TransferToWindow对象
 * 保证在dom节点还未挂载到页面上时其transferToWindow对象不为空
 */
export default new TransferToWindow(
  {
    inw: 1920,
    inh: 1080,
    outw: 1920,
    outh: 1080,
  },
  false,
);
