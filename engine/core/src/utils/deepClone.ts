/**
 * Deep clone a value.
 *
 * We're using rfdc for this, but maintaining our own implementation
 * to avoid production dependencies on external libraries.
 *
 * @source https://github.com/davidmarkclements/rfdc
 */

type CloneFunction<T = any> = (obj: T) => T;
type ConstructorHandler<T = any> = (obj: T, fn: CloneFunction) => T;
type ConstructorHandlerTuple<T = any> = [new (...args: Array<any>) => T, ConstructorHandler<T>];

interface RfdcOptions {
	circular?: boolean;
	proto?: boolean;
	constructorHandlers?: Array<ConstructorHandlerTuple>;
}

function copyBuffer(cur: ArrayBufferView): ArrayBufferView {
	if (cur instanceof Buffer) {
		return Buffer.from(cur);
	}

	const TypedArrayConstructor = cur.constructor as new (
		buffer: ArrayBuffer,
		byteOffset: number,
		length: number,
	) => ArrayBufferView;

	return new TypedArrayConstructor(
		(cur.buffer as ArrayBuffer).slice(0),
		cur.byteOffset,
		cur.byteLength / (cur as any).BYTES_PER_ELEMENT || 1,
	);
}

export function rfdc<T = any>(opts?: RfdcOptions): CloneFunction<T> {
	opts = opts || {};

	if (opts.circular) {
		return rfdcCircular<T>(opts);
	}

	const constructorHandlers = new Map<new (...args: Array<any>) => any, ConstructorHandler>();
	constructorHandlers.set(Date, (o: Date) => new Date(o));
	constructorHandlers.set(
		Map,
		(o: Map<any, any>, fn: CloneFunction) => new Map(cloneArray(Array.from(o), fn)),
	);
	constructorHandlers.set(
		Set,
		(o: Set<any>, fn: CloneFunction) => new Set(cloneArray(Array.from(o), fn)),
	);

	if (opts.constructorHandlers) {
		for (const handler of opts.constructorHandlers) {
			constructorHandlers.set(handler[0], handler[1]);
		}
	}

	let handler: ConstructorHandler | undefined;

	return (opts.proto ? cloneProto : clone) as CloneFunction<T>;

	function cloneArray(a: Array<any>, fn: CloneFunction): Array<any> {
		const keys = Object.keys(a);
		const a2: Array<any> = Array.from({ length: keys.length });

		for (let i = 0; i < keys.length; i++) {
			const k = keys[i] as any;
			const cur = a[k];

			if (typeof cur !== "object" || cur === null) {
				a2[k] = cur;
			} else if (
				cur.constructor !== Object &&
				(handler = constructorHandlers.get(cur.constructor))
			) {
				a2[k] = handler(cur, fn);
			} else if (ArrayBuffer.isView(cur)) {
				a2[k] = copyBuffer(cur);
			} else {
				a2[k] = fn(cur);
			}
		}
		return a2;
	}

	function clone(o: any): any {
		if (typeof o !== "object" || o === null) {
			return o;
		}
		if (Array.isArray(o)) {
			return cloneArray(o, clone);
		}

		if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
			return handler(o, clone);
		}

		const o2: Record<string, any> = {};

		for (const k in o) {
			if (Object.hasOwn(o, k) === false) {
				continue;
			}

			const cur = o[k];

			if (typeof cur !== "object" || cur === null) {
				o2[k] = cur;
			} else if (
				cur.constructor !== Object &&
				(handler = constructorHandlers.get(cur.constructor))
			) {
				o2[k] = handler(cur, clone);
			} else if (ArrayBuffer.isView(cur)) {
				o2[k] = copyBuffer(cur);
			} else {
				o2[k] = clone(cur);
			}
		}
		return o2;
	}

	function cloneProto(o: any): any {
		if (typeof o !== "object" || o === null) {
			return o;
		}
		if (Array.isArray(o)) {
			return cloneArray(o, cloneProto);
		}

		if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
			return handler(o, cloneProto);
		}

		const o2: Record<string, any> = {};

		for (const k in o) {
			const cur = o[k];

			if (typeof cur !== "object" || cur === null) {
				o2[k] = cur;
			} else if (
				cur.constructor !== Object &&
				(handler = constructorHandlers.get(cur.constructor))
			) {
				o2[k] = handler(cur, cloneProto);
			} else if (ArrayBuffer.isView(cur)) {
				o2[k] = copyBuffer(cur);
			} else {
				o2[k] = cloneProto(cur);
			}
		}
		return o2;
	}
}

function rfdcCircular<T = any>(opts: RfdcOptions): CloneFunction<T> {
	const refs: Array<any> = [];
	const refsNew: Array<any> = [];

	const constructorHandlers = new Map<new (...args: Array<any>) => any, ConstructorHandler>();
	constructorHandlers.set(Date, (o: Date) => new Date(o));
	constructorHandlers.set(
		Map,
		(o: Map<any, any>, fn: CloneFunction) => new Map(cloneArray(Array.from(o), fn)),
	);
	constructorHandlers.set(
		Set,
		(o: Set<any>, fn: CloneFunction) => new Set(cloneArray(Array.from(o), fn)),
	);

	if (opts.constructorHandlers) {
		for (const handler of opts.constructorHandlers) {
			constructorHandlers.set(handler[0], handler[1]);
		}
	}

	let handler: ConstructorHandler | undefined;

	return (opts.proto ? cloneProto : clone) as CloneFunction<T>;

	function cloneArray(a: Array<any>, fn: CloneFunction): Array<any> {
		const keys = Object.keys(a);
		const a2: Array<any> = Array.from({ length: keys.length });

		for (let i = 0; i < keys.length; i++) {
			const k = keys[i] as any;
			const cur = a[k];

			if (typeof cur !== "object" || cur === null) {
				a2[k] = cur;
			} else if (
				cur.constructor !== Object &&
				(handler = constructorHandlers.get(cur.constructor))
			) {
				a2[k] = handler(cur, fn);
			} else if (ArrayBuffer.isView(cur)) {
				a2[k] = copyBuffer(cur);
			} else {
				const index = refs.indexOf(cur);
				if (index !== -1) {
					a2[k] = refsNew[index];
				} else {
					a2[k] = fn(cur);
				}
			}
		}
		return a2;
	}

	function clone(o: any): any {
		if (typeof o !== "object" || o === null) {
			return o;
		}
		if (Array.isArray(o)) {
			return cloneArray(o, clone);
		}

		if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
			return handler(o, clone);
		}

		const o2: Record<string, any> = {};
		refs.push(o);
		refsNew.push(o2);

		for (const k in o) {
			if (Object.hasOwn(o, k) === false) {
				continue;
			}

			const cur = o[k];

			if (typeof cur !== "object" || cur === null) {
				o2[k] = cur;
			} else if (
				cur.constructor !== Object &&
				(handler = constructorHandlers.get(cur.constructor))
			) {
				o2[k] = handler(cur, clone);
			} else if (ArrayBuffer.isView(cur)) {
				o2[k] = copyBuffer(cur);
			} else {
				const i = refs.indexOf(cur);
				if (i !== -1) {
					o2[k] = refsNew[i];
				} else {
					o2[k] = clone(cur);
				}
			}
		}

		refs.pop();
		refsNew.pop();
		return o2;
	}

	function cloneProto(o: any): any {
		if (typeof o !== "object" || o === null) {
			return o;
		}
		if (Array.isArray(o)) {
			return cloneArray(o, cloneProto);
		}

		if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
			return handler(o, cloneProto);
		}

		const o2: Record<string, any> = {};
		refs.push(o);
		refsNew.push(o2);

		for (const k in o) {
			const cur = o[k];

			if (typeof cur !== "object" || cur === null) {
				o2[k] = cur;
			} else if (
				cur.constructor !== Object &&
				(handler = constructorHandlers.get(cur.constructor))
			) {
				o2[k] = handler(cur, cloneProto);
			} else if (ArrayBuffer.isView(cur)) {
				o2[k] = copyBuffer(cur);
			} else {
				const i = refs.indexOf(cur);
				if (i !== -1) {
					o2[k] = refsNew[i];
				} else {
					o2[k] = cloneProto(cur);
				}
			}
		}

		refs.pop();
		refsNew.pop();
		return o2;
	}
}

export const deepClone = rfdc();
