 (func $72 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (if (result i32)
   (i32.gt_u
    (i32.load offset=96
     (local.tee $0
      (i32.load
       (i32.add
        (i32.load
         (i32.const 2980)
        )
        (i32.shl
         (local.get $0)
         (i32.const 2)
        )
       )
      )
     )
    )
    (local.get $1)
   )
   (then
    (local.set $1
     (call $9
      (local.get $0)
      (local.get $1)
      (i32.const 0)
     )
    )
    (local.set $0
     (i32.load offset=24
      (i32.add
       (i32.load offset=16
        (local.get $0)
       )
       (i32.mul
        (i32.load offset=88
         (local.get $0)
        )
        (i32.const 28)
       )
      )
     )
    )
    (i32.store
     (i32.const 3176)
     (local.get $1)
    )
    (i32.store
     (i32.const 3172)
     (local.get $0)
    )
    (i32.const 3172)
   )
   (else
    (i32.const 0)
   )
  )
 )
