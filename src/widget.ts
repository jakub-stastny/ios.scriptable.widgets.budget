/*
 * I might not be understanding the definition type files well.
 * Anyway changing .d.ts -> .ts and adding export before 'declare'
 * makes this work.

 * cp node_modules/@types/scriptable-ios/index.d.ts scriptable-ios.ts
 */
import { Image } from './scriptable-ios.ts'

export class Widget {
  widget: ListWidget

  constructor(url: string, blockFn?) {
    this.widget = new ListWidget()
    this.widget.spacing = 5
    this.widget.url = url

    if (blockFn) {
      blockFn(this)
      this.render()
    }
  }

  // setBackgroundImage(fileName) {
  //   const fm = FileManager.iCloud()
  //   const filePath = [fm.documentsDirectory(), 'Widgets', fileName].join('/')
  //   this.widget.backgroundImage = Image.fromFile(filePath)
  // }

  line(text: string, colour: Color = Color.black()) {
    const renderedText = this.widget.addText(text) // OR UITable?
    renderedText.textColor = colour
    console.log(renderedText)
    renderedText.textOpacity = 0.8
    renderedText.font = new Font('Helvetica', 12)

    // this.widget.addText('') // Vertical space.

    return renderedText
  }

  render() {
    Script.setWidget(this.widget)
    Script.complete()
  }
}
