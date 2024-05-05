document.addEventListener("mousemove", onMouseMove);
document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mouseup", onMouseUp);

function onMouseMove(e) {
	const mouseMoveEvent = new CustomEvent('readermousemove', { detail: { x: e.screenX, y: e.screenY } });
	window.parent.dispatchEvent(mouseMoveEvent);
}

function onMouseDown(e) {
	const mouseDownEvent = new CustomEvent('readermousedown', { detail: { x: e.screenX, y: e.screenY } });
	window.parent.dispatchEvent(mouseDownEvent);
}

function onMouseUp(e) {
	const mouseUpEvent = new CustomEvent('readermouseup', { detail: { x: e.screenX, y: e.screenY } });
	window.parent.dispatchEvent(mouseUpEvent);
}
