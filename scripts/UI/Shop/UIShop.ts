import * as pc from "playcanvas";
import { IUIController } from '../../Interface/IUIController'
import { AssetManager } from "../../Manager/AssetManager";
import { SafeKeyAsset } from "../../Helper/SafeKeyAsset";
import { UIText } from "../Common/UIText";
import { UIPanel } from "../Common/UIPanel";
import { UIManager } from "../../Manager/UIManager";
import { BackHomeButton } from "./BackHomeButton";
import { CoinManager } from "../../Manager/CoinManager";

export class UIShop extends pc.Entity implements IUIController {
    private app: pc.Application;
    private assetManager: AssetManager;
    private uiManager: UIManager;
    private scoreText: UIText;
    private screenWidth:number;
    private screenHeight:number;

    constructor(app: pc.Application, uiManager: UIManager) {
        super();
        this.app = app;
        this.screenWidth = this.app.graphicsDevice.width;
        this.screenHeight = this.app.graphicsDevice.height;
        this.assetManager = AssetManager.getInstance();
        this.uiManager = uiManager;
        this.setElement();
        this.setUpPanel();
        this.setupText();
        this.setupButtons();
        this.setUpScrollView();
    }

    private setElement() {
        this.addComponent('element', {
            anchor: [0.5, 0.5, 0.5, 0.5],
            pivot: [0.5, 0.5],
            width: this.app.graphicsDevice.width,
            height: this.app.graphicsDevice.height,
            type: pc.ELEMENTTYPE_GROUP
        });
    }

    private setUpPanel(){
        const backgroundTexture = this.assetManager.getAsset(SafeKeyAsset.IMGBarTop);
        const barTopPanel = new UIPanel(new pc.Vec2(this.screenWidth, this.screenHeight*0.2), backgroundTexture);
        barTopPanel.entity.element!.anchor = new pc.Vec4(0.5, 1, 0.5, 1);
        barTopPanel.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
        this.addChild(barTopPanel.entity);

        const scrollView = new UIPanel(new pc.Vec2(this.screenWidth, this.screenHeight), backgroundTexture);
        scrollView.entity.element!.anchor = new pc.Vec4(0.5, 0, 0.5, 0.05);
        scrollView.entity.element!.pivot = new pc.Vec2(0.5, 0.5);
        this.addChild(scrollView.entity);
    }

    private setupText() {
        const fontSize = this.screenWidth/19;
        const scorePosition = new pc.Vec2(0, 0);
        const scoreTexture = this.assetManager.getAsset(SafeKeyAsset.IMGCoinLabel);
        const distanceTexture = this.assetManager.getAsset(SafeKeyAsset.IMGDistanceLabel);
        const timeTexture = this.assetManager.getAsset(SafeKeyAsset.IMGTimeLabel);
        const lableSize = new pc.Vec2(this.screenWidth / 3.5, this.screenHeight / 16);
        const textColor = new pc.Color(0, 0, 0);
        const textPosition = new pc.Vec2(10, 0);

        this.scoreText = new UIText(
            this.app,
            this.assetManager,
            "",
            lableSize,
            scorePosition,
            fontSize,
            textColor,
            scoreTexture,
            textPosition,
        );

        this.scoreText.entity.element!.anchor = new pc.Vec4(0.7, 0.92, 0.7, 0.92);
        this.scoreText.entity.element!.pivot = new pc.Vec2(0, 0);
        this.scoreText.setText(CoinManager.getInstance().getTotalCoins());
        this.addChild(this.scoreText.entity);
    }

    private setupButtons() {
        const backHomeButton = new BackHomeButton(this.app, new pc.Vec2(0, 0),
        new pc.Vec2(this.screenHeight *0.065, this.screenHeight *0.065), this.assetManager);
        backHomeButton.entity.element!.anchor = new pc.Vec4(0.03, 0.92, 0.03, 0.92);
        backHomeButton.entity.element!.pivot = new pc.Vec2(0, 0);
        this.addChild(backHomeButton.entity);
    }

    private setUpScrollView(){
        function createScrollbar(horizontal) {
            const handle = new pc.Entity('Handle');
            const handleOptions = {
                type: pc.ELEMENTTYPE_IMAGE,
                color: new pc.Color(1, 1, 1),
                opacity: 1,
                margin: new pc.Vec4(0, 0, 0, 0),
                rect: new pc.Vec4(0, 0, 1, 1),
                mask: false,
                useInput: true
            };
            if (horizontal) {
                // @ts-ignore engine-tsd
                handleOptions.anchor = new pc.Vec4(0, 0, 0, 1); // Split in Y
                // @ts-ignore engine-tsd
                handleOptions.pivot = new pc.Vec2(0, 0); // Bottom left
            } else {
                // @ts-ignore engine-tsd
                handleOptions.anchor = new pc.Vec4(0, 1, 1, 1); // Split in X
                // @ts-ignore engine-tsd
                handleOptions.pivot = new pc.Vec2(1, 1); // Top right
            }
            handle.addComponent('element', handleOptions);
            handle.addComponent('button', {
                active: true,
                imageEntity: handle,
                hitPadding: new pc.Vec4(0, 0, 0, 0),
                transitionMode: pc.BUTTON_TRANSITION_MODE_TINT,
                hoverTint: new pc.Color(1, 1, 1),
                pressedTint: new pc.Color(1, 1, 1),
                inactiveTint: new pc.Color(1, 1, 1),
                fadeDuration: 0
            });
    
            const scrollbar = new pc.Entity(horizontal ? 'HorizontalScrollbar' : 'VerticalScrollbar');
    
            scrollbar.addChild(handle);
    
            const scrollbarOptions = {
                type: pc.ELEMENTTYPE_IMAGE,
                color: new pc.Color(0.5, 0.5, 0.5),
                opacity: 1,
                rect: new pc.Vec4(0, 0, 1, 1),
                mask: false,
                useInput: false
            };
    
            const scrollbarSize = 20;
    
            if (horizontal) {
                // @ts-ignore engine-tsd
                scrollbarOptions.anchor = new pc.Vec4(0, 0, 1, 0);
                // @ts-ignore engine-tsd
                scrollbarOptions.pivot = new pc.Vec2(0, 0);
                // @ts-ignore engine-tsd
                scrollbarOptions.margin = new pc.Vec4(0, 0, scrollbarSize, -scrollbarSize);
            } else {
                // @ts-ignore engine-tsd
                scrollbarOptions.anchor = new pc.Vec4(1, 0, 1, 1);
                // @ts-ignore engine-tsd
                scrollbarOptions.pivot = new pc.Vec2(1, 1);
                // @ts-ignore engine-tsd
                scrollbarOptions.margin = new pc.Vec4(-scrollbarSize, scrollbarSize, 0, 0);
            }
            scrollbar.addComponent('element', scrollbarOptions);
            scrollbar.addComponent('scrollbar', {
                orientation: horizontal ? pc.ORIENTATION_HORIZONTAL : pc.ORIENTATION_VERTICAL,
                value: 0,
                handleSize: 0.5,
                handleEntity: handle
            });
    
            return scrollbar;
        }
    
        // Create some text content
        const text = new pc.Entity('Text');
        text.addComponent('element', {
            alignment: new pc.Vec2(0, 0),
            anchor: new pc.Vec4(0, 1, 0, 1),
            autoHeight: true,
            autoWidth: false,
            fontAsset: this.assetManager.getAsset(SafeKeyAsset.Font),
            fontSize: 32,
            lineHeight: 36,
            pivot: new pc.Vec2(0, 1),
            text:
                'This is a scroll view control. You can scroll the content by dragging the vertical ' +
                'or horizontal scroll bars, by dragging the content itself, by using the mouse wheel, or ' +
                'by using a trackpad. Notice the elastic bounce if you drag the content beyond the ' +
                'limits of the scroll view.',
            type: pc.ELEMENTTYPE_TEXT,
            width: 600,
            wrapLines: true
        });
    
        // Group to hold the content inside the scroll view's viewport
        const content = new pc.Entity('Content');
        content.addChild(text);
    
        content.addComponent('element', {
            anchor: new pc.Vec4(0, 1, 0, 1),
            height: 400,
            pivot: new pc.Vec2(0, 1),
            type: pc.ELEMENTTYPE_GROUP,
            useInput: true,
            width: 600
        });
    
        // Scroll view viewport
        const viewport = new pc.Entity('Viewport');
        viewport.addChild(content);
    
        viewport.addComponent('element', {
            anchor: new pc.Vec4(0, 0, 1, 1),
            color: new pc.Color(0.2, 0.2, 0.2),
            margin: new pc.Vec4(0, 20, 20, 0),
            mask: true,
            opacity: 1,
            pivot: new pc.Vec2(0, 1),
            rect: new pc.Vec4(0, 0, 1, 1),
            type: pc.ELEMENTTYPE_IMAGE,
            useInput: false
        });
    
        const horizontalScrollbar = createScrollbar(true);
        const verticalScrollbar = createScrollbar(false);
    
        // Create a scroll view
        const scrollview = new pc.Entity('ScrollView');
        scrollview.addChild(viewport);
        scrollview.addChild(horizontalScrollbar);
        scrollview.addChild(verticalScrollbar);
    
        // You must add the scrollview entity to the hierarchy BEFORE adding the scrollview component
        this.addChild(scrollview);
    
        scrollview.addComponent('element', {
            anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
            height: 200,
            pivot: new pc.Vec2(0.5, 0.5),
            type: pc.ELEMENTTYPE_GROUP,
            useInput: false,
            width: 400
        });
    
        scrollview.addComponent('scrollview', {
            bounceAmount: 0.1,
            contentEntity: content,
            friction: 0.05,
            useMouseWheel: true,
            mouseWheelSensitivity: pc.Vec2.ONE,
            horizontal: true,
            horizontalScrollbarEntity: horizontalScrollbar,
            horizontalScrollbarVisibility: pc.SCROLLBAR_VISIBILITY_SHOW_WHEN_REQUIRED,
            scrollMode: pc.SCROLL_MODE_BOUNCE,
            vertical: true,
            verticalScrollbarEntity: verticalScrollbar,
            verticalScrollbarVisibility: pc.SCROLLBAR_VISIBILITY_SHOW_WHEN_REQUIRED,
            viewportEntity: viewport
        });
    }

    Open(): void {
        this.enabled = true;
    }

    Close(): void {
        this.enabled = false;
    }
}
