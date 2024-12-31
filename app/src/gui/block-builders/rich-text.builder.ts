import { BlockBuilderBase, BlockId, End } from "slack-block-builder/dist/internal";

type IRichTextBuilder = BlockBuilderBase &
  BlockId &
  End & {
    elements: (o: object) => IRichTextBuilder;
  };

// Ugly but necessary to mimic `slack-block-builder` usage.
export const RichText = () => new RichTextBuilder() as unknown as IRichTextBuilder;

/**
 * Rich text top-level element.
 *
 * This attempts to mimic the way `slack-block-builder` works because it does
 * not support rich text elements. By no means does this implementation adhere
 * to `slack-block-builder`'s interfaces but it is similar enough to work in
 * practice. The point is to make code using rich text elements look similar to
 * other block builder code, especially to avoid writing objects with build
 * methods.
 */
export class RichTextBuilder {
  private elementList = [];

  constructor() {
    return this;
  }

  build() {
    return {
      type: "rich_text",
      elements: this.elementList,
    };
  }

  elements(...elements: unknown[]): this {
    this.elementList = elements;
    return this;
  }
}
